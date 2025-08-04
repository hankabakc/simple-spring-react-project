package com.table.table.service;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.table.table.dto.request.ProductRequest;
import com.table.table.dto.response.ProductResponse;
import com.table.table.model.Category;
import com.table.table.model.Product;
import com.table.table.model.ProductImage;
import com.table.table.repository.CategoryRepository;
import com.table.table.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CartItemService cartItemService;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository,
            CartItemService cartItemService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.cartItemService = cartItemService;
    }

    public ProductResponse convertResponse(Product product) {
        List<String> images = product.getImages().stream()
                .map(ProductImage::getBase64Image)
                .collect(Collectors.toList());

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getExplanation(),
                product.getPrice(),
                images,
                product.getCategory().getName());
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
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setExplanation(request.getExplanation());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        product.setCategory(category);

        // Hata veren kısmı düzeltin
        // getImages() null dönebileceği için Optional veya ternary operator kullanın
        List<ProductImage> productImages = Optional.ofNullable(request.getImages())
                .orElse(Collections.emptyList()) // Eğer null ise boş bir liste kullan
                .stream()
                .filter(image -> image != null && !image.isEmpty())
                .map(image -> {
                    try {
                        String base64 = Base64.getEncoder().encodeToString(image.getBytes());
                        return new ProductImage(base64, product);
                    } catch (IOException e) {
                        throw new RuntimeException("Resim dönüştürme hatası", e);
                    }
                })
                .collect(Collectors.toList());

        product.setImages(productImages);

        Product saved = productRepository.save(product);
        return convertResponse(saved);
    }

    @Transactional
    public void deleteProduct(Long id) {
        // İlk olarak bu ürünle ilişkili tüm sepet öğelerini sil
        cartItemService.deleteAllByProductId(id);

        // Ardından ürünü sil
        productRepository.deleteById(id);
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
            products = productRepository.findAll();
        }

        return products.stream()
                .map(this::convertResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse updateProduct(ProductRequest request) {
        Product existing = productRepository.findById(request.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ürün bulunamadı"));

        existing.setName(request.getName());
        existing.setPrice(request.getPrice());
        existing.setExplanation(request.getExplanation());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kategori bulunamadı"));
        existing.setCategory(category);

        // Hata veren kısmı düzeltin
        existing.getImages().clear();

        List<ProductImage> newImages = Optional.ofNullable(request.getImages())
                .orElse(Collections.emptyList()) // Eğer null ise boş bir liste kullan
                .stream()
                .filter(image -> image != null && !image.isEmpty())
                .map(image -> {
                    try {
                        String base64 = Base64.getEncoder().encodeToString(image.getBytes());
                        return new ProductImage(base64, existing);
                    } catch (IOException e) {
                        throw new RuntimeException("Resim dönüştürme hatası", e);
                    }
                })
                .collect(Collectors.toList());

        existing.getImages().addAll(newImages);

        Product saved = productRepository.save(existing);
        return convertResponse(saved);
    }
}