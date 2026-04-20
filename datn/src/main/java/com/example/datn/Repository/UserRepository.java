package com.example.datn.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.datn.Domain.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    Page<User> findAllByRoleName(String roleName, Pageable pageable);

    User findByEmail(String email);

    User findByRefreshTokenAndEmail(String token, String email);

    long countByRole_Name(String roleName);
}
