package com.auction.service;

import com.auction.dto.AuctionRequest;
import com.auction.dto.BidRequest;
import com.auction.dto.BidResponse;
import com.auction.entity.Auction;
import com.auction.entity.AuctionStatus;
import com.auction.entity.Bid;
import com.auction.entity.Product;
import com.auction.entity.Transaction;
import com.auction.entity.User;
import com.auction.repository.AuctionRepository;
import com.auction.repository.BidRepository;
import com.auction.repository.ProductRepository;
import com.auction.repository.TransactionRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;
    private final BidRepository bidRepository;
    private final TransactionRepository transactionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public AuctionService(
            AuctionRepository auctionRepository,
            ProductRepository productRepository,
            CurrentUserService currentUserService,
            BidRepository bidRepository,
            TransactionRepository transactionRepository,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.auctionRepository = auctionRepository;
        this.productRepository = productRepository;
        this.currentUserService = currentUserService;
        this.bidRepository = bidRepository;
        this.transactionRepository = transactionRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public Auction createAuction(AuctionRequest request) {

        User seller = currentUserService.getCurrentUser();

        if (request.getProductId() == null) {
            throw new RuntimeException("Product id is required");
        }

        if (request.getStartingPrice() == null) {
            throw new RuntimeException("Starting price is required");
        }

        if (request.getEndTime() == null) {
            throw new RuntimeException("Auction end time is required");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new RuntimeException("You can create auction only for your own product");
        }

        if (auctionRepository.existsByProduct(product)) {
            throw new RuntimeException("Auction already exists for this product");
        }

        if (request.getStartingPrice().compareTo(product.getBasePrice()) < 0) {
            throw new RuntimeException("Starting price cannot be less than base price");
        }

        if (request.getEndTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Auction end time must be in the future");
        }

        Auction auction = new Auction();
        auction.setProduct(product);
        auction.setStartingPrice(request.getStartingPrice());
        auction.setCurrentPrice(request.getStartingPrice());
        auction.setBuyNowPrice(request.getBuyNowPrice());
        auction.setStartTime(LocalDateTime.now());
        auction.setEndTime(request.getEndTime());
        auction.setStatus(AuctionStatus.ACTIVE);

        return auctionRepository.save(auction);
    }

    public Bid placeBid(Long auctionId, BidRequest request) {

        User buyer = currentUserService.getCurrentUser();

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new RuntimeException("Auction is not active");
        }

        if (auction.getEndTime().isBefore(LocalDateTime.now())) {
            auction.setStatus(AuctionStatus.CLOSED);
            auctionRepository.save(auction);
            throw new RuntimeException("Auction is already closed");
        }

        if (auction.getProduct().getSeller().getId().equals(buyer.getId())) {
            throw new RuntimeException("Seller cannot bid on own product");
        }

        if (request.getAmount().compareTo(auction.getCurrentPrice()) <= 0) {
            throw new RuntimeException("Bid must be higher than current price");
        }

        Bid bid = new Bid();
        bid.setAuction(auction);
        bid.setBidder(buyer);
        bid.setAmount(request.getAmount());

        auction.setCurrentPrice(request.getAmount());
        auctionRepository.save(auction);

        Bid savedBid = bidRepository.save(bid);

        BidResponse bidResponse = new BidResponse(
                savedBid.getId(),
                auction.getId(),
                savedBid.getAmount(),
                buyer.getFullName(),
                savedBid.getBidTime()
        );

        messagingTemplate.convertAndSend(
                "/topic/auction/" + auction.getId(),
                bidResponse
        );

        return savedBid;
    }

    public List<Auction> getMyAuctions() {
        User seller = currentUserService.getCurrentUser();
        return auctionRepository.findByProductSellerId(seller.getId());
    }

    public User getCurrentSeller() {
        return currentUserService.getCurrentUser();
    }

    public Transaction buyNow(Long auctionId) {

        User buyer = currentUserService.getCurrentUser();

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new RuntimeException("Auction is not active");
        }

        if (auction.getEndTime().isBefore(LocalDateTime.now())) {
            auction.setStatus(AuctionStatus.CLOSED);
            auctionRepository.save(auction);
            throw new RuntimeException("Auction is already closed");
        }

        if (auction.getBuyNowPrice() == null) {
            throw new RuntimeException("Buy Now is not available for this auction");
        }

        if (auction.getProduct().getSeller().getId().equals(buyer.getId())) {
            throw new RuntimeException("Seller cannot buy own product");
        }

        User seller = auction.getProduct().getSeller();

        auction.setCurrentPrice(auction.getBuyNowPrice());
        auction.setStatus(AuctionStatus.SOLD);
        auctionRepository.save(auction);

        BigDecimal commission = auction.getBuyNowPrice()
                .multiply(new BigDecimal("0.05"))
                .setScale(2, RoundingMode.HALF_UP);

        Transaction transaction = new Transaction();
        transaction.setAuction(auction);
        transaction.setBuyer(buyer);
        transaction.setSeller(seller);
        transaction.setAmount(auction.getBuyNowPrice());
        transaction.setCommission(commission);

        return transactionRepository.save(transaction);
    }
}