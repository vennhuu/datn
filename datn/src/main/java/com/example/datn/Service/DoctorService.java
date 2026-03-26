package com.example.datn.Service;

import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.datn.Domain.Doctor;
import com.example.datn.Domain.Hospital;
import com.example.datn.Domain.Role;
import com.example.datn.Domain.User;
import com.example.datn.Domain.request.ReqCreateDoctor;
import com.example.datn.Domain.request.ReqUpdateDoctor;
import com.example.datn.Domain.response.doctor.ResDoctor;
import com.example.datn.Domain.response.pagination.Meta;
import com.example.datn.Domain.response.pagination.ResPageResultDTO;
import com.example.datn.Repository.DoctorRepository;
import com.example.datn.Repository.HospitalRepository;
import com.example.datn.Repository.RoleRepository;
import com.example.datn.Repository.UserRepository;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final HospitalRepository hospitalRepository ;

    public DoctorService(
        DoctorRepository doctorRepository,
        UserRepository userRepository,
        RoleRepository roleRepository,
        PasswordEncoder passwordEncoder,
        HospitalRepository hospitalRepository
    ) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.hospitalRepository = hospitalRepository ;
    }

    // tạo bác sĩ
    public ResDoctor createDoctor(ReqCreateDoctor req) {

        // tạo user
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setGender(req.getGender());
        user.setBirthday(req.getBirthday());
        user.setAddress(req.getAddress());
        user.setMobile(req.getMobile());
        user.setAbout(req.getAbout());
        user.setAvatar(req.getAvatar());

        user.setPassword(passwordEncoder.encode(req.getPassword()));

        Role role = roleRepository.findByName("ROLE_DOCTOR")
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRole(role);

        // tạo doctor
        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpecialization(req.getSpecialization());
        doctor.setDegree(req.getDegree());
        Hospital hospital = hospitalRepository.findById(req.getHospital().getId())
            .orElseThrow(() -> new RuntimeException("Hospital not found"));

        doctor.setHospital(hospital);
        doctor.setExperienceYears(req.getExperienceYears());
        doctor.setBio(req.getBio());

        Doctor savedDoctor = doctorRepository.save(doctor);

        return convertToResDoctor(savedDoctor);
    }

    // lấy tất cả bác sĩ
    public ResPageResultDTO getAllDoctors(int currentPage, int pageSize, Pageable pageable) {

        Page<Doctor> pageDoctor = doctorRepository.findAll(pageable);

        ResPageResultDTO res = new ResPageResultDTO();
        Meta meta = new Meta();

        meta.setCurrentPage(currentPage);
        meta.setPageSize(pageSize);
        meta.setTotalElements(pageDoctor.getTotalElements());
        meta.setTotalPages(pageDoctor.getTotalPages());

        res.setMeta(meta);

        res.setResult(
            pageDoctor.getContent()
                .stream()
                .map(this::convertToResDoctor)
                .collect(Collectors.toList())
        );

        return res;
    }

    public ResDoctor getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return convertToResDoctor(doctor);
    }

    // cập nhật bác sĩ
    public ResDoctor updateDoctor(Long id, ReqUpdateDoctor req) {

        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // update doctor
        doctor.setSpecialization(req.getSpecialization());
        doctor.setDegree(req.getDegree());
        doctor.setHospital(req.getHospital());
        doctor.setExperienceYears(req.getExperienceYears());
        doctor.setBio(req.getBio());

        // update user
        User user = doctor.getUser();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setGender(req.getGender());
        user.setBirthday(req.getBirthday());
        user.setAddress(req.getAddress());
        user.setMobile(req.getMobile());
        user.setAbout(req.getAbout());

        userRepository.save(user);

        Doctor updated = doctorRepository.save(doctor);

        return convertToResDoctor(updated);
    }

    // xóa bác sĩ
    public void deleteDoctor(Long id) {

        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));

        User user = doctor.getUser();

        doctorRepository.delete(doctor);
        userRepository.delete(user);
    }

    // đổi dữ liệu sang resdoctor
    private ResDoctor convertToResDoctor(Doctor doctor) {

        User user = doctor.getUser();

        ResDoctor res = new ResDoctor();
        res.setId(doctor.getId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setGender(user.getGender()) ;
        res.setBirthday(user.getBirthday());
        res.setAddress(user.getAddress());
        res.setMobile(user.getMobile());
        res.setAbout(user.getAbout());
        res.setAvatar(user.getAvatar());

        res.setSpecialization(doctor.getSpecialization());
        res.setDegree(doctor.getDegree());
        res.setHospital(doctor.getHospital().getName());
        res.setExperienceYears(doctor.getExperienceYears());
        res.setBio(doctor.getBio());

        return res;
    }

    public boolean existById( long id ) {
        return this.doctorRepository.existsById(id);
    }

    public boolean existsByEmail (String email) {
        return this.userRepository.existsByEmail(email ) ;
    }

    public User findById( long id ) {
        Optional<User> optionalUser = this.userRepository.findById(id) ;
        if ( optionalUser.isPresent() ) {
            return optionalUser.get() ;
        }
        return null ;
    }
}