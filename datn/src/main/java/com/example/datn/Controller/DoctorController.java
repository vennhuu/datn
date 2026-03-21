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

import com.example.datn.Domain.request.ReqCreateDoctor;
import com.example.datn.Domain.response.doctor.ResDoctor;
import com.example.datn.Domain.response.pagination.ResPageResultDTO;
import com.example.datn.Service.DoctorService;
import com.example.datn.Utils.annotation.APIMessage;
import com.example.datn.Utils.errors.InvalidException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // CREATE
    @PostMapping("/doctors")
    @APIMessage("Create a new doctor")
    public ResponseEntity<ResDoctor> createDoctor(@RequestBody ReqCreateDoctor req) {
        return ResponseEntity.ok(doctorService.createDoctor(req));
    }

    // GET ALL
    @GetMapping("/doctors")
    @APIMessage("Get all doctor")
    public ResponseEntity<ResPageResultDTO> getAllDoctors(
        @RequestParam("current") Optional<String> currentOptional,
        @RequestParam("pageSize") Optional<String> pageSizeOptional
    ) {

        int currentPage = Integer.parseInt(currentOptional.orElse("1"));
        int pageSize = Integer.parseInt(pageSizeOptional.orElse("10"));

        Pageable pageable = PageRequest.of(currentPage - 1, pageSize, Sort.by("id"));

        return ResponseEntity.ok(
            doctorService.getAllDoctors(currentPage, pageSize, pageable)
        );
    }

    // GET BY ID
    @GetMapping("/doctors/{id}")
    @APIMessage("Get doctor by id")
    public ResponseEntity<ResDoctor> getDoctor(@PathVariable Long id) throws InvalidException {
        if ( !this.doctorService.existById(id)) {
            throw new InvalidException("Không tìm thấy người dùng này") ;
        }
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    // UPDATE
    @PutMapping("/doctors")
    public ResponseEntity<ResDoctor> updateDoctor(
        @Valid @RequestBody ReqCreateDoctor req
    ) throws InvalidException {
        if ( !this.doctorService.existById(req.getId())) {
            throw new InvalidException("Không tìm thấy người dùng này") ;
        }
        return ResponseEntity.ok(doctorService.updateDoctor(req.getId(), req));
    }

    // DELETE
    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}