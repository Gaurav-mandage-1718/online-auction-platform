package com.auction.repository;

import com.auction.entity.Auction;
import com.auction.entity.Bid;
import com.auction.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByAuctionOrderByAmountDesc(Auction auction);

    List<Bid> findByBidder(User bidder);
}