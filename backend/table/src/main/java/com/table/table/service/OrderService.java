package com.table.table.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.table.table.model.Order;
import com.table.table.model.User;
import com.table.table.repository.OrderRepository;
import com.table.table.repository.UserRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public Order createOrder(Long userId, String name,
            String price, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setName(name);
        order.setPrice(new java.math.BigDecimal(price));
        order.setQuantity(quantity);

        return orderRepository.save(order);
    }

    // Kullanıcının siparişlerini getir
    public List<Order> getOrdersByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(user);
    }

    // Tüm siparişleri getir (Admin)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
