package com.auction.controller;

import com.auction.dto.ProductRequest;
import com.auction.dto.TransactionResponse;
import com.auction.dto.AuctionRequest;
import com.auction.entity.Auction;
import com.auction.service.AuctionService;
import com.auction.entity.Product;
import com.auction.service.ProductService;
import org.springframework.web.bind.annotation.*;
import com.auction.entity.Transaction;
import com.auction.repository.TransactionRepository;

import java.util.List;

@RestController
@RequestMapping("/api/seller")
@CrossOrigin(origins = "*")
public class SellerController {

    private final ProductService productService;
    private final TransactionRepository transactionRepository;
    private final AuctionService auctionService;

    public SellerController(
            ProductService productService,
            AuctionService auctionService,
            TransactionRepository transactionRepository
    ) {
        this.productService = productService;
        this.auctionService = auctionService;
        this.transactionRepository = transactionRepository;
    }
    
    @GetMapping("/sales")
    public List<TransactionResponse> mySales() {
        return transactionRepository.findBySeller(
                auctionService.getCurrentSeller()
        )
        .stream()
        .map(TransactionResponse::new)
        .toList();
    }
    
    @PostMapping("/auctions")
    public Auction createAuction(@RequestBody AuctionRequest request) {
        return auctionService.createAuction(request);
    }

    @GetMapping("/auctions")
    public List<Auction> getMyAuctions() {
        return auctionService.getMyAuctions();
    }

    @GetMapping("/dashboard")
    public String sellerDashboard() {
        return "Welcome Seller! You can add products and manage auctions.";
    }

    @PostMapping("/products")
    public Product addProduct(@RequestBody ProductRequest request) {
        return productService.addProduct(request);
    }

    @GetMapping("/products")
    public List<Product> getMyProducts() {
        return productService.getMyProducts();
    }
}