package com.auction.dto;

import com.auction.entity.Auction;
import com.auction.entity.AuctionStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AuctionResponse {

    private Long id;
    private ProductResponse product;
    private BigDecimal startingPrice;
    private BigDecimal currentPrice;
    private BigDecimal buyNowPrice;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private AuctionStatus status;

    public AuctionResponse(Auction auction) {
        this.id = auction.getId();
        this.product = new ProductResponse(auction.getProduct());
        this.startingPrice = auction.getStartingPrice();
        this.currentPrice = auction.getCurrentPrice();
        this.buyNowPrice = auction.getBuyNowPrice();
        this.startTime = auction.getStartTime();
        this.endTime = auction.getEndTime();
        this.status = auction.getStatus();
    }

    public Long getId() { return id; }
    public ProductResponse getProduct() { return product; }
    public BigDecimal getStartingPrice() { return startingPrice; }
    public BigDecimal getCurrentPrice() { return currentPrice; }
    public BigDecimal getBuyNowPrice() { return buyNowPrice; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public AuctionStatus getStatus() { return status; }
}