package com.auction.controller;

import com.auction.dto.AuctionResponse;
import com.auction.entity.AuctionStatus;
import com.auction.repository.AuctionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin(origins = "*")
public class PublicAuctionController {

    private final AuctionRepository auctionRepository;

    public PublicAuctionController(AuctionRepository auctionRepository) {
        this.auctionRepository = auctionRepository;
    }

    @GetMapping
    public List<AuctionResponse> getActiveAuctions() {
        return auctionRepository.findByStatus(AuctionStatus.ACTIVE)
                .stream()
                .map(AuctionResponse::new)
                .toList();
    }

    @GetMapping("/{id}")
    public AuctionResponse getAuctionById(@PathVariable Long id) {
        return auctionRepository.findById(id)
                .map(AuctionResponse::new)
                .orElseThrow(() -> new RuntimeException("Auction not found"));
    }
}