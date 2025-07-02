package com.table.table.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.table.table.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
