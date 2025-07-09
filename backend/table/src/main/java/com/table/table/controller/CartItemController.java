package com.table.table.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.table.table.dto.request.CartItemRequest;
import com.table.table.dto.response.CartItemResponse;
import com.table.table.service.CartItemService;

@RestController
@RequestMapping("/api/cart")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Boolean>> addToCart(@RequestBody CartItemRequest request) {
        cartItemService.addToCart(request);
        Map<String, Boolean> response = new HashMap<>();
        response.put("result", true);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getUserCart(@RequestParam Long userId) {
        List<CartItemResponse> cart = cartItemService.getUserCart(userId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/item")
    public ResponseEntity<Map<String, Boolean>> removeFromCart(
            @RequestParam Long userId,
            @RequestParam Long productId) {
        cartItemService.deleteFromCart(userId, productId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("result", true);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Boolean>> clearCart(@RequestParam Long userId) {
        cartItemService.clearCart(userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("result", true);
        return ResponseEntity.ok(response);
    }
}
