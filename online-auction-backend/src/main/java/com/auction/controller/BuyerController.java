package com.auction.controller;

import com.auction.dto.BidRequest;
import com.auction.dto.TransactionResponse;
import com.auction.entity.Bid;
import com.auction.entity.Transaction;
import com.auction.entity.User;
import com.auction.entity.Watchlist;
import com.auction.repository.BidRepository;
import com.auction.repository.TransactionRepository;
import com.auction.repository.WatchlistRepository;
import com.auction.service.AuctionService;
import com.auction.service.CurrentUserService;
import com.auction.service.WatchlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/buyer")
@CrossOrigin(origins = "*")
public class BuyerController {

    private final AuctionService auctionService;
    private final TransactionRepository transactionRepository;
    private final CurrentUserService currentUserService;
    private final WatchlistService watchlistService;
    private final BidRepository bidRepository;
    private final WatchlistRepository watchlistRepository;

    public BuyerController(
            AuctionService auctionService,
            TransactionRepository transactionRepository,
            CurrentUserService currentUserService,
            WatchlistService watchlistService,
            BidRepository bidRepository,
            WatchlistRepository watchlistRepository
    ) {
        this.auctionService = auctionService;
        this.transactionRepository = transactionRepository;
        this.currentUserService = currentUserService;
        this.watchlistService = watchlistService;
        this.bidRepository = bidRepository;
        this.watchlistRepository = watchlistRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> buyerDashboard() {

        User buyer = currentUserService.getCurrentUser();

        return Map.of(
                "myBids", bidRepository.findByBidder(buyer).size(),
                "myTransactions", transactionRepository.findByBuyer(buyer).size(),
                "watchlistItems", watchlistRepository.countByBuyer(buyer)
        );
    }

    @PostMapping("/watchlist/{auctionId}")
    public Watchlist addToWatchlist(@PathVariable Long auctionId) {
        return watchlistService.addToWatchlist(auctionId);
    }

    @GetMapping("/watchlist")
    public List<Watchlist> myWatchlist() {
        return watchlistService.getMyWatchlist();
    }

    @DeleteMapping("/watchlist/{auctionId}")
    public Map<String, String> removeFromWatchlist(@PathVariable Long auctionId) {
        return Map.of("message", watchlistService.removeFromWatchlist(auctionId));
    }

    @PostMapping("/auctions/{auctionId}/buy-now")
    public Transaction buyNow(@PathVariable Long auctionId) {
        return auctionService.buyNow(auctionId);
    }

    @GetMapping("/transactions")
    public List<TransactionResponse> myTransactions() {
        return transactionRepository.findByBuyer(currentUserService.getCurrentUser())
                .stream()
                .map(TransactionResponse::new)
                .toList();
    }
    
    @PostMapping("/auctions/{auctionId}/bid")
    public Bid placeBid(
            @PathVariable Long auctionId,
            @RequestBody BidRequest request
    ) {
        return auctionService.placeBid(auctionId, request);
    }
}