package com.table.table.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class ProductResponse {
    private Long id;
    private String name;
    private String explanation;
    private BigDecimal price;
    private List<String> base64Images; // ← çoklu görsel için değiştirildi
    private String categoryName;

    public ProductResponse() {
    }

    public ProductResponse(Long id, String name, String explanation, BigDecimal price, List<String> base64Images,
            String categoryName) {
        this.id = id;
        this.name = name;
        this.explanation = explanation;
        this.price = price;
        this.base64Images = base64Images;
        this.categoryName = categoryName;
    }

    // Getter - Setter

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public List<String> getBase64Images() {
        return base64Images;
    }

    public void setBase64Images(List<String> base64Images) {
        this.base64Images = base64Images;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
