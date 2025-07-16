package com.table.table.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.table.table.dto.request.OrderRequest;
import com.table.table.model.Order;
import com.table.table.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody OrderRequest request,
            Principal principal) {

        String username = principal.getName();
        Order created = orderService.createOrder(username, request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(orderService.getOrdersByUsername(username));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
