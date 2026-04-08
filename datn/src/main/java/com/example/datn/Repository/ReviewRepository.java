package com.example.datn.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.datn.Domain.Doctor;
import com.example.datn.Domain.Review;
import com.example.datn.Domain.User;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDoctorIdOrderByIdDesc(Long doctorId);
    boolean existsByUserAndDoctor(User user, Doctor doctor);
}