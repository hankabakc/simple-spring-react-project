package com.table.table.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.table.table.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);
}