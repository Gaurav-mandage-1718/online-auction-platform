package com.auction.repository;

import com.auction.entity.Auction;
import com.auction.entity.AuctionStatus;
import com.auction.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuctionRepository extends JpaRepository<Auction, Long> {

    List<Auction> findByProductSellerId(Long sellerId);

    boolean existsByProduct(Product product);

    List<Auction> findByStatus(AuctionStatus status);
}