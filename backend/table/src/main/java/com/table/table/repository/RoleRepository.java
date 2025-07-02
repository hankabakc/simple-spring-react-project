package com.table.table.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.table.table.model.Role;

public interface  RoleRepository extends JpaRepository<Role, Long>{
    
}
