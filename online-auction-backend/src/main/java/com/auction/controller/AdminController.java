package com.auction.controller;

import com.auction.entity.Auction;
import com.auction.entity.Transaction;
import com.auction.entity.User;
import com.auction.repository.AuctionRepository;
import com.auction.repository.TransactionRepository;
import com.auction.repository.UserRepository;
import com.auction.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;
    private final TransactionRepository transactionRepository;
    private final AdminService adminService;

    public AdminController(
            UserRepository userRepository,
            AuctionRepository auctionRepository,
            TransactionRepository transactionRepository,
            AdminService adminService
    ) {
        this.userRepository = userRepository;
        this.auctionRepository = auctionRepository;
        this.transactionRepository = transactionRepository;
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return adminService.dashboard();
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/users/{userId}/block")
    public User blockUser(@PathVariable Long userId) {
        return adminService.blockUser(userId);
    }

    @PutMapping("/users/{userId}/unblock")
    public User unblockUser(@PathVariable Long userId) {
        return adminService.unblockUser(userId);
    }

    @GetMapping("/auctions")
    public List<Auction> getAllAuctions() {
        return auctionRepository.findAll();
    }

    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}