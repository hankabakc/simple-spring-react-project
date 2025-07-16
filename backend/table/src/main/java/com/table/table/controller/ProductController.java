package com.table.table.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.table.table.dto.request.ProductRequest;
import com.table.table.dto.response.ProductResponse;
import com.table.table.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/detail")
    public ResponseEntity<ProductResponse> getProductById(@RequestParam Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Boolean>> createProduct(@ModelAttribute ProductRequest request) {
        productService.createProduct(request);
        Map<String, Boolean> response = new HashMap<>();
        response.put("result", true);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Boolean>> deleteProduct(@RequestParam Long id) {
        productService.deleteProduct(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("result", true);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<Long> categories) {
        List<ProductResponse> products = productService.searchProducts(search, categories);
        return ResponseEntity.ok(products);
    }
}
