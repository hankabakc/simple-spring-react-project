package com.table.table.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.table.table.dto.response.CartItemResponse;
import com.table.table.model.CartItem;
import com.table.table.model.Product;
import com.table.table.model.ProductImage;
import com.table.table.model.User;
import com.table.table.repository.CartItemRepository;
import com.table.table.repository.ProductRepository;
import com.table.table.repository.UserRepository;

@Service
public class CartItemService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartItemService(CartItemRepository cartItemRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    private CartItemResponse toDto(CartItem item) {
        Product product = item.getProduct();

        List<String> imageList = product.getImages().stream()
                .map(ProductImage::getBase64Image)
                .collect(Collectors.toList());

        CartItemResponse dto = new CartItemResponse();
        dto.setProductId(product.getId());
        dto.setProductName(product.getName());
        dto.setProductImages(imageList);
        dto.setProductPrice(product.getPrice());
        dto.setQuantity(item.getQuantity());

        return dto;
    }

    @Transactional
    public void addToCart(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        CartItem existing = cartItemRepository.findByUserIdAndProductId(userId, productId);
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
            cartItemRepository.save(existing);
        } else {
            CartItem item = new CartItem();
            item.setUser(user);
            item.setProduct(product);
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> getUserCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserIdOrderByIdAsc(userId);
        return items.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteFromCart(Long userId, Long productId) {
        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, productId);
        if (item != null) {
            cartItemRepository.delete(item);
        }
    }

    @Transactional
    public void clearCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        cartItemRepository.deleteAll(items);
    }

    @Transactional
    public void setQuantityForUser(Long userId, Long productId, Integer newQuantity) {
        if (newQuantity <= 0) {
            deleteFromCart(userId, productId);
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        CartItem existing = cartItemRepository.findByUserIdAndProductId(userId, productId);
        if (existing != null) {
            existing.setQuantity(newQuantity);
            cartItemRepository.save(existing);
        } else {
            CartItem item = new CartItem();
            item.setUser(user);
            item.setProduct(product);
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        }
    }
}
