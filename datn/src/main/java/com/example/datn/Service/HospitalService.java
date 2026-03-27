package com.example.datn.Service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.datn.Domain.Hospital;
import com.example.datn.Domain.response.pagination.Meta;
import com.example.datn.Domain.response.pagination.ResPageResultDTO;
import com.example.datn.Repository.HospitalRepository;

@Service
public class HospitalService {
    
    private final HospitalRepository hospitalRepository ;

    public HospitalService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    public Hospital save( Hospital hospital ) {
        return this.hospitalRepository.save(hospital) ;
    }

    public Hospital createNewHospital( Hospital hospital ) {
        Hospital newHospital = new Hospital() ;
        newHospital.setId(hospital.getId());
        newHospital.setName(hospital.getName());
        newHospital.setCity(hospital.getCity());
        newHospital.setAddress(hospital.getAddress());
        newHospital.setIntroduction(hospital.getIntroduction());
        newHospital.setLogo(hospital.getLogo()) ;
        newHospital.setRating(hospital.getRating());
        newHospital.setDoctors(hospital.getDoctors());
        return this.save(newHospital) ;
    }

    public ResPageResultDTO getAllHospitals(
        // int currentPage, int pageSize, Pageable pageable
        Specification<Hospital> spec ,
        Pageable pageable
    ) {
        ResPageResultDTO res = new ResPageResultDTO() ;

        Page<Hospital> pageHospital = this.hospitalRepository.findAll(spec , pageable) ;
        Meta meta = new Meta() ;
        meta.setCurrentPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalElements(pageHospital.getTotalElements());
        meta.setTotalPages(pageHospital.getTotalPages());

        res.setMeta(meta);
        res.setResult(pageHospital.getContent());

        return res ;
    }

    public boolean existById( long id ) {
        return this.hospitalRepository.existsById(id) ;
    }

    public Hospital getHospitalById(Long id) {
        Optional<Hospital> optionalHospital = this.hospitalRepository.findById(id) ;
        if ( optionalHospital.isPresent() ) {
            return optionalHospital.get() ;
        }
        return null ;
    }

    public Hospital updateHospital(Long id, Hospital req) {
        Hospital updateHospital = new Hospital() ;
        updateHospital.setId(id);
        updateHospital.setName(req.getName());
        updateHospital.setCity(req.getCity());
        updateHospital.setAddress(req.getAddress());
        updateHospital.setIntroduction(req.getIntroduction());
        updateHospital.setLogo(req.getLogo()) ;
        updateHospital.setRating(req.getRating());
        updateHospital.setDoctors(req.getDoctors());
        return this.save(updateHospital) ;
    }

    public void deleteHospital(Long id) {
        this.hospitalRepository.deleteById(id);
    }

   public Hospital findById( long id ) {
        Optional<Hospital> optionalHospital = this.hospitalRepository.findById(id) ;
        if ( optionalHospital.isPresent() ) {
            return optionalHospital.get() ;
        }
        return null ;
    }
    
}
