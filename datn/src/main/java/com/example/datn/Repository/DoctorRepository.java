package com.example.datn.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.datn.Domain.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> , JpaSpecificationExecutor<Doctor> {
    public boolean existsById(long id) ;

    public List<Doctor> findByHospitalId( long id ) ;

}
