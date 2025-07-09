package com.table.table.controller;

import com.table.table.dto.request.CartItemRequest;
import com.table.table.dto.response.CartItemResponse;
import com.table.table.service.CartItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartItemService cartItemService;

    public CartController(CartItemService cartItemService) {
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
