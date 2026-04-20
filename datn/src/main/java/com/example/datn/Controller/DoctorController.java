package com.example.datn.Controller;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.datn.Domain.Doctor;
import com.example.datn.Domain.User;
import com.example.datn.Domain.request.ReqCreateDoctor;
import com.example.datn.Domain.request.ReqUpdateDoctor;
import com.example.datn.Domain.response.doctor.ResDoctor;
import com.example.datn.Domain.response.pagination.ResPageResultDTO;
import com.example.datn.Repository.DoctorRepository;
import com.example.datn.Service.DoctorService;
import com.example.datn.Service.HospitalService;
import com.example.datn.Service.UserService;
import com.example.datn.Utils.annotation.APIMessage;
import com.example.datn.Utils.errors.InvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class DoctorController {

    private final DoctorService doctorService;
    private final UserService userService ;
    private final HospitalService hospitalService ;
    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorService doctorService , UserService userService , HospitalService hospitalService , DoctorRepository doctorRepository) {
        this.doctorService = doctorService;
        this.userService = userService ;
        this.hospitalService = hospitalService ;
        this.doctorRepository = doctorRepository ;
    }

    // CREATE
    @PostMapping("/doctors")
    @APIMessage("Create a new doctor")
    public ResponseEntity<ResDoctor> createDoctor(@Valid @RequestBody ReqCreateDoctor req) throws InvalidException {
        if (this.doctorService.existsByEmail(req.getEmail())) {
            throw new InvalidException("Email đã tồn tại, hãy nhập email khác");
        }
        return ResponseEntity.ok(doctorService.createDoctor(req));
    }

    // GET ALL
    @GetMapping("/doctors")
    @APIMessage("Get all doctor")
    public ResponseEntity<ResPageResultDTO> getAllDoctors(
        @Filter Specification<Doctor> spec , Pageable pageable
    ) {
        return ResponseEntity.ok( this.doctorService.getAllDoctors(spec , pageable) );
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
    @APIMessage("Update doctors")
    public ResponseEntity<ResDoctor> updateDoctor(
        @Valid @RequestBody ReqUpdateDoctor req
    ) throws InvalidException {
        if ( !this.doctorService.existById(req.getId())) {
            throw new InvalidException("Không tìm thấy người dùng này") ;
        }
        return ResponseEntity.ok(doctorService.updateDoctor(req.getId(), req));
    }

    // DELETE
    @DeleteMapping("/doctors/{id}")
    @APIMessage("Delete doctor by id")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    @PutMapping("/doctors/avatar")
    @APIMessage("Update user avatar")
    public ResponseEntity<String> updateAvatar(
            @RequestParam Long userId,
            @RequestParam String avatar
    ) throws InvalidException {

        User user = userService.findById(userId);

        if (user == null) {
            throw new InvalidException("User không tồn tại");
        }

        user.setAvatar(avatar);

        userService.save(user);

        return ResponseEntity.ok("Avatar updated");
    }

    @GetMapping("/by-hospital/{id}")
    @APIMessage("Get all doctor by hospital id")
    public ResponseEntity<List<ResDoctor>> getAllDoctorByHospitalId(@PathVariable long id) throws InvalidException{
        if ( !this.hospitalService.existById(id) ) {
            throw new InvalidException("Khong co benh vien nay") ;
        }
        return ResponseEntity.ok(this.doctorService.findByHospitalId(id));
    }

    // GET profile của bác sĩ đang đăng nhập
    @GetMapping("/doctors/profile/me")
    @APIMessage("Get my profile")
    public ResponseEntity<ResDoctor> getMyProfile() throws InvalidException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Doctor doctor = doctorRepository.findByUserEmail(email)
            .orElseThrow(() -> new InvalidException("Không tìm thấy hồ sơ"));
        return ResponseEntity.ok(doctorService.getDoctorById(doctor.getId()));
    }

    // UPDATE profile của bác sĩ đang đăng nhập
    @PutMapping("/doctors/profile/me")
    @APIMessage("Update my profile")
    public ResponseEntity<ResDoctor> updateMyProfile(@RequestBody ReqUpdateDoctor req) throws InvalidException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Doctor doctor = doctorRepository.findByUserEmail(email)
            .orElseThrow(() -> new InvalidException("Không tìm thấy hồ sơ"));
        return ResponseEntity.ok(doctorService.updateDoctor(doctor.getId(), req));
    }

    @GetMapping("/doctors/count")
    @APIMessage("Count all doctors")
    public ResponseEntity<Long> totalDoctors() {
        return ResponseEntity.ok(this.userService.getTotalUsers("ROLE_DOCTOR"));
    }
}