package com.table.table.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.table.table.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);

    CartItem findByUserIdAndProductId(Long userId, Long productId);

    List<CartItem> findByUserIdOrderByIdAsc(Long userId);

}