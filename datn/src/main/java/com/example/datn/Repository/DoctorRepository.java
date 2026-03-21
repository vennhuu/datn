package com.example.datn.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.datn.Domain.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    public boolean existsById(long id) ;

}
