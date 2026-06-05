package com.auction.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BidResponse {

    private Long bidId;
    private Long auctionId;
    private BigDecimal amount;
    private String bidderName;
    private LocalDateTime bidTime;

    public BidResponse(Long bidId, Long auctionId, BigDecimal amount, String bidderName, LocalDateTime bidTime) {
        this.bidId = bidId;
        this.auctionId = auctionId;
        this.amount = amount;
        this.bidderName = bidderName;
        this.bidTime = bidTime;
    }

    public Long getBidId() {
        return bidId;
    }

    public Long getAuctionId() {
        return auctionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getBidderName() {
        return bidderName;
    }

    public LocalDateTime getBidTime() {
        return bidTime;
    }
}