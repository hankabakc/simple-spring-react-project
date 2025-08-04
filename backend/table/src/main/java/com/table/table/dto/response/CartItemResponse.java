package com.table.table.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class CartItemResponse {
    private Long productId;
    private String productName;
    private List<String> productImages; // ← Güncellendi
    private BigDecimal productPrice;
    private Integer quantity;

    public CartItemResponse() {
    }

    public CartItemResponse(Long productId, String productName, List<String> productImages, BigDecimal productPrice,
            Integer quantity) {
        this.productId = productId;
        this.productName = productName;
        this.productImages = productImages;
        this.productPrice = productPrice;
        this.quantity = quantity;
    }

    // Getters - Setters

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public List<String> getProductImages() {
        return productImages;
    }

    public void setProductImages(List<String> productImages) {
        this.productImages = productImages;
    }

    public BigDecimal getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(BigDecimal productPrice) {
        this.productPrice = productPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
