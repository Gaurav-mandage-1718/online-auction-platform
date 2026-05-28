package com.auction.repository;

import com.auction.entity.Product;
import com.auction.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySeller(User seller);
}