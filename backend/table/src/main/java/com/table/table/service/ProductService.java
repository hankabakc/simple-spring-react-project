package com.table.table.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.table.table.dto.request.ProductRequest;
import com.table.table.dto.response.ProductResponse;
import com.table.table.model.Category;
import com.table.table.model.Product;
import com.table.table.repository.CategoryRepository;
import com.table.table.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductResponse convertResponse(Product product) {
        ProductResponse dto = new ProductResponse();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setExplanation(product.getExplanation());
        dto.setPrice(product.getPrice());
        dto.setBase64Image(product.getBase64Image());
        dto.setCategoryName(product.getCategory().getName());
        return dto;
    }

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream().map(this::convertResponse).toList();
    }

    public ProductResponse getProductById(Long id) {
        return productRepository.findById(id).map(this::convertResponse).orElse(null);
    }

    public Product createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setExplanation(request.getExplanation());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Kategori yok"));
        product.setCategory(category);

        return productRepository.save(product);
    }

}
