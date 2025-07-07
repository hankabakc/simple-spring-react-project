package com.table.table.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.table.table.dto.response.CategoryResponse;
import com.table.table.model.Category;
import com.table.table.repository.CategoryRepository;

@Service
public class CategoryService {

    public CategoryResponse convertResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }

    private CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::convertResponse).toList();
    }

    public CategoryResponse getCategoryById(Long id) {
        return categoryRepository.findById(id).map(this::convertResponse).orElse(null);
    }
}
