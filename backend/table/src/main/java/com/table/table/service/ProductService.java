package com.table.table.service;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

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

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

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

    private ProductResponse mapToProductResponse(Product product) {
        if (product == null) {
            return null;
        }
        String categoryName = (product.getCategory() != null) ? product.getCategory().getName() : null;
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getExplanation(),
                product.getPrice(),
                product.getBase64Image(),
                categoryName);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::convertResponse)
                .orElse(null);
    }

    @Transactional
    public Product createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setExplanation(request.getExplanation());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        product.setCategory(category);

        MultipartFile image = request.getImage();
        if (image != null && !image.isEmpty()) {
            try {
                String base64 = Base64.getEncoder().encodeToString(image.getBytes());
                product.setBase64Image(base64);
            } catch (IOException e) {
                throw new RuntimeException("Resim dönüştürme hatası", e);
            }
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found : " + id));
        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String search, List<Long> categoryIds) {
        List<Product> products;

        boolean hasSearchTerm = search != null && !search.trim().isEmpty();
        boolean hasCategoryIds = categoryIds != null && !categoryIds.isEmpty();

        if (hasSearchTerm && hasCategoryIds) {
            products = productRepository.findByNameContainingIgnoreCaseAndCategoryIdIn(search, categoryIds);
        } else if (hasSearchTerm) {
            products = productRepository.findByNameContainingIgnoreCase(search);
        } else if (hasCategoryIds) {
            products = productRepository.findByCategoryIdIn(categoryIds);
        } else {
            // Hem arama terimi hem de kategori ID'leri boşsa, tüm ürünleri getir
            products = productRepository.findAll();
        }

        return products.stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }
}