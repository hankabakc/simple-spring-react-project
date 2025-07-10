package com.table.table.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class SequenceFixer {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public SequenceFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void fixSequences() {
        System.out.println("✅ SequenceFixer çalışıyor...");

        fixSequence("users", "users_id_seq");
        fixSequence("role", "role_id_seq");
        fixSequence("product", "product_id_seq");
        fixSequence("category", "category_id_seq");
        fixSequence("cart_item", "cart_item_id_seq");

        System.out.println("✅ SequenceFixer tamamlandı.");
    }

    private void fixSequence(String tableName, String sequenceName) {
        String sql = String.format(
                "SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users) + 1, false);",
                sequenceName, tableName);
        jdbcTemplate.execute(sql);
    }
}
