package com.table.table.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.table.table.dto.request.ProductRequest;
import com.table.table.dto.response.ProductResponse;
import com.table.table.service.ProductService;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ProductService productService;

    public AdminController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> createProduct(@ModelAttribute ProductRequest request) {
        ProductResponse created = productService.createProduct(request);
        return ResponseEntity.ok(created);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteProduct(@RequestParam Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
