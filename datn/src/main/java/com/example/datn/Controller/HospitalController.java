package com.example.datn.Controller;

import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.datn.Domain.Hospital;
import com.example.datn.Domain.response.pagination.ResPageResultDTO;
import com.example.datn.Service.HospitalService;
import com.example.datn.Utils.annotation.APIMessage;
import com.example.datn.Utils.errors.InvalidException;

import jakarta.validation.Valid;



@RestController
@RequestMapping("/api/v1")
public class HospitalController {

    private final HospitalService hospitalService ;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @PostMapping("/hospitals")
    @APIMessage("Create a new hospital")
    public ResponseEntity<Hospital> createHospital(@Valid @RequestBody Hospital hospital) throws InvalidException {
        
        return ResponseEntity.ok(hospitalService.createNewHospital(hospital));
    }
    

    @GetMapping("/hospitals")
    @APIMessage("Get all hospital")
    public ResponseEntity<ResPageResultDTO> getAllHospital(
        @RequestParam("current") Optional<String> currentOptional,
        @RequestParam("pageSize") Optional<String> pageSizeOptional
    ) {

        int currentPage = Integer.parseInt(currentOptional.orElse("1"));
        int pageSize = Integer.parseInt(pageSizeOptional.orElse("10"));

        Pageable pageable = PageRequest.of(currentPage - 1, pageSize, Sort.by("id"));

        return ResponseEntity.ok( hospitalService.getAllHospitals(currentPage, pageSize, pageable) );
    }

    // GET BY ID
    @GetMapping("/hospitals/{id}")
    @APIMessage("Get hospital by id")
    public ResponseEntity<Hospital> getHospital(@PathVariable Long id) throws InvalidException {
        if ( !this.hospitalService.existById(id)) {
            throw new InvalidException("Không tìm thấy benh vien này") ;
        }
        return ResponseEntity.ok(hospitalService.getHospitalById(id));
    }

    // UPDATE
    @PutMapping("/hospitals")
    public ResponseEntity<Hospital> updateHospital(
        @Valid @RequestBody Hospital req
    ) throws InvalidException {
        if ( !this.hospitalService.existById(req.getId())) {
            throw new InvalidException("Không tìm thấy benh vien này") ;
        }
        return ResponseEntity.ok(hospitalService.updateHospital(req.getId(), req));
    }

    // DELETE
    @DeleteMapping("/hospitals/{id}")
    public ResponseEntity<String> deleteHospital(@PathVariable Long id) throws InvalidException {

        Hospital hospital = this.hospitalService.getHospitalById(id);
        if (hospital == null) {
            throw new InvalidException("Không tồn tại bệnh viện này");
        }
        hospitalService.deleteHospital(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    @PutMapping("/hospitals/logo")
    @APIMessage("Update hospital logo")
    public ResponseEntity<String> updateLogo(
            @RequestParam Long hospitalId,
            @RequestParam String logo
    ) throws InvalidException {

        Hospital hospital = hospitalService.findById(hospitalId);

        if (hospital == null) {
            throw new InvalidException("Bệnh viện không tồn tại");
        }

        hospital.setLogo(logo);

        hospitalService.save(hospital);

        return ResponseEntity.ok("Avatar updated");
    }
}
