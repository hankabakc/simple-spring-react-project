package com.table.table.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.table.table.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);

}
