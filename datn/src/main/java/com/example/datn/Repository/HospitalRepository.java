package com.example.datn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.datn.Domain.Hospital;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital , Long> {
    
}
