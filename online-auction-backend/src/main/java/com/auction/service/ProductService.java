package com.auction.service;

import com.auction.dto.ProductRequest;
import com.auction.entity.Product;
import com.auction.entity.User;
import com.auction.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CurrentUserService currentUserService;

    public ProductService(
            ProductRepository productRepository,
            CurrentUserService currentUserService
    ) {
        this.productRepository = productRepository;
        this.currentUserService = currentUserService;
    }

    public Product addProduct(ProductRequest request) {

        User seller = currentUserService.getCurrentUser();

        Product product = new Product();
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setBasePrice(request.getBasePrice());
        product.setSeller(seller);

        return productRepository.save(product);
    }

    public List<Product> getMyProducts() {
        User seller = currentUserService.getCurrentUser();
        return productRepository.findBySeller(seller);
    }
}