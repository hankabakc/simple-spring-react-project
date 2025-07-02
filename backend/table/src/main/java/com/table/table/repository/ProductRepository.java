package com.table.table.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.table.table.model.Product;

public interface  ProductRepository extends JpaRepository<Product, Long> {
    
}
