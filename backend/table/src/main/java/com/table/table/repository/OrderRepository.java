package com.table.table.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.table.table.model.Order;
import com.table.table.model.User;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);

}