package com.auction.service;

import com.auction.entity.User;
import com.auction.repository.AuctionRepository;
import com.auction.repository.BidRepository;
import com.auction.repository.TransactionRepository;
import com.auction.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;
    private final BidRepository bidRepository;
    private final TransactionRepository transactionRepository;

    public AdminService(
            UserRepository userRepository,
            AuctionRepository auctionRepository,
            BidRepository bidRepository,
            TransactionRepository transactionRepository
    ) {
        this.userRepository = userRepository;
        this.auctionRepository = auctionRepository;
        this.bidRepository = bidRepository;
        this.transactionRepository = transactionRepository;
    }

    public User blockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBlocked(true);
        return userRepository.save(user);
    }

    public User unblockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBlocked(false);
        return userRepository.save(user);
    }

    public Map<String, Object> dashboard() {

        BigDecimal totalCommission = transactionRepository.findAll()
                .stream()
                .map(transaction -> transaction.getCommission())
                .filter(commission -> commission != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of(
                "totalUsers", userRepository.count(),
                "totalAuctions", auctionRepository.count(),
                "totalBids", bidRepository.count(),
                "totalTransactions", transactionRepository.count(),
                "totalCommission", totalCommission
        );
    }
}