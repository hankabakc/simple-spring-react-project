package com.table.table.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.table.table.model.User;

public interface  UserRepository extends JpaRepository<User, Long>{
    
}
