package com.table.table.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.table.table.dto.request.OrderRequest;
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

    // Sipariş oluştur
    public Order createOrder(String username, OrderRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setName(request.getName());
        order.setPrice(new BigDecimal(request.getPrice()));
        order.setQuantity(request.getQuantity());

        return orderRepository.save(order);
    }

    // Kullanıcının siparişleri
    public List<Order> getOrdersByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(user);
    }

    // Admin için tüm siparişler
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
