package com.table.table.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.table.table.dto.request.CartItemRequest;
import com.table.table.dto.response.CartItemResponse;
import com.table.table.security.UserDetailsImpl;
import com.table.table.service.CartItemService;

@RestController
@RequestMapping("/api/cart")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetailsImpl userDetails) {
            return userDetails.getId();
        } else {
            throw new RuntimeException("Invalid user details in security context");
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Boolean>> addToCart(@RequestBody CartItemRequest request) {
        Long userId = getCurrentUserId(); // TOKEN'dan alıyoruz
        cartItemService.addToCart(userId, request.getProductId(), request.getQuantity());
        Map<String, Boolean> response = new HashMap<>();
        response.put("result", true);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getUserCart() {
        Long userId = getCurrentUserId();
        List<CartItemResponse> cart = cartItemService.getUserCart(userId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/item")
    public ResponseEntity<Map<String, Boolean>> removeFromCart(@RequestParam Long productId) {
        Long userId = getCurrentUserId();
        cartItemService.deleteFromCart(userId, productId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("result", true);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Boolean>> clearCart() {
        Long userId = getCurrentUserId();
        cartItemService.clearCart(userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("result", true);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<Map<String, Boolean>> setCartQuantity(@RequestBody CartItemRequest request) {
        Long userId = getCurrentUserId();
        cartItemService.setQuantityForUser(userId, request.getProductId(), request.getQuantity());
        Map<String, Boolean> response = new HashMap<>();
        response.put("result", true);
        return ResponseEntity.ok(response);
    }
}
