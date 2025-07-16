// src/main/java/com/table/table/repository/ProductRepository.java
package com.table.table.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.table.table.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Ürün adına göre ve/veya kategori ID'lerine göre ürünleri arayan metot.
    // Spring Data JPA bu metot adından otomatik olarak SQL sorgusunu
    // oluşturacaktır.
    // 'ContainingIgnoreCase' arama terimini büyük/küçük harf duyarsız yapar ve LIKE
    // %terim% şeklinde arar.
    // 'CategoryIdIn' ise verilen kategori ID'leri listesi içinde eşleşenleri bulur.
    List<Product> findByNameContainingIgnoreCaseAndCategoryIdIn(String name, List<Long> categoryIds);

    // Sadece isme göre arama için (eğer kategoriler boşsa bu kullanılabilir)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Sadece kategoriye göre arama için (eğer arama terimi boşsa bu kullanılabilir)
    List<Product> findByCategoryIdIn(List<Long> categoryIds);

    // Eğer hem arama hem de kategori boşsa tüm ürünleri getirmek için findAll
    // yeterli.
}