package com.auction.service;

import com.auction.entity.Auction;
import com.auction.entity.User;
import com.auction.entity.Watchlist;
import com.auction.repository.AuctionRepository;
import com.auction.repository.WatchlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final AuctionRepository auctionRepository;
    private final CurrentUserService currentUserService;

    public WatchlistService(
            WatchlistRepository watchlistRepository,
            AuctionRepository auctionRepository,
            CurrentUserService currentUserService
    ) {
        this.watchlistRepository = watchlistRepository;
        this.auctionRepository = auctionRepository;
        this.currentUserService = currentUserService;
    }

    public Watchlist addToWatchlist(Long auctionId) {

        User buyer = currentUserService.getCurrentUser();

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        if (auction.getProduct().getSeller().getId().equals(buyer.getId())) {
            throw new RuntimeException("Seller cannot add own auction to watchlist");
        }

        return watchlistRepository.findByBuyerAndAuction(buyer, auction)
                .orElseGet(() -> {
                    Watchlist watchlist = new Watchlist();
                    watchlist.setBuyer(buyer);
                    watchlist.setAuction(auction);
                    return watchlistRepository.save(watchlist);
                });
    }

    public List<Watchlist> getMyWatchlist() {
        User buyer = currentUserService.getCurrentUser();
        return watchlistRepository.findByBuyer(buyer);
    }

    public String removeFromWatchlist(Long auctionId) {

        User buyer = currentUserService.getCurrentUser();

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        Watchlist watchlist = watchlistRepository.findByBuyerAndAuction(buyer, auction)
                .orElseThrow(() -> new RuntimeException("Auction not found in watchlist"));

        watchlistRepository.delete(watchlist);

        return "Removed from watchlist";
    }
}