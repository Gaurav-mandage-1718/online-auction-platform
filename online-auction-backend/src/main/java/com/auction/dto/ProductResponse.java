package com.auction.dto;

import com.auction.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String imageUrl;
    private BigDecimal basePrice;
    private String sellerName;
    private LocalDateTime createdAt;

    public ProductResponse(Product product) {
        this.id = product.getId();
        this.title = product.getTitle();
        this.description = product.getDescription();
        this.category = product.getCategory();
        this.imageUrl = product.getImageUrl();
        this.basePrice = product.getBasePrice();
        this.sellerName = product.getSeller().getFullName();
        this.createdAt = product.getCreatedAt();
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getImageUrl() { return imageUrl; }
    public BigDecimal getBasePrice() { return basePrice; }
    public String getSellerName() { return sellerName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}