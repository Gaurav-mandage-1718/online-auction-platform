package com.auction.dto;

import com.auction.entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {

    private Long id;
    private Long auctionId;
    private String productTitle;
    private String buyerName;
    private String sellerName;
    private BigDecimal amount;
    private BigDecimal commission;
    private String status;
    private LocalDateTime transactionTime;

    public TransactionResponse(Transaction transaction) {
        this.id = transaction.getId();
        this.auctionId = transaction.getAuction().getId();
        this.productTitle = transaction.getAuction().getProduct().getTitle();
        this.buyerName = transaction.getBuyer().getFullName();
        this.sellerName = transaction.getSeller().getFullName();
        this.amount = transaction.getAmount();
        this.commission = transaction.getCommission();
        this.status = transaction.getStatus();
        this.transactionTime = transaction.getTransactionTime();
    }

    public Long getId() { return id; }
    public Long getAuctionId() { return auctionId; }
    public String getProductTitle() { return productTitle; }
    public String getBuyerName() { return buyerName; }
    public String getSellerName() { return sellerName; }
    public BigDecimal getAmount() { return amount; }
    public BigDecimal getCommission() { return commission; }
    public String getStatus() { return status; }
    public LocalDateTime getTransactionTime() { return transactionTime; }
}