package com.table.table.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.table.table.dto.ProductRequest;
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

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setExplanation(request.getExplanation());
        product.setBase64Image(request.getBase64Image());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Kategori yok"));
        product.setCategory(category);

        return productRepository.save(product);
    }

}
