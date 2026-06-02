package com.auction.repository;

import com.auction.entity.Transaction;
import com.auction.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByBuyer(User buyer);

    List<Transaction> findBySeller(User seller);
}