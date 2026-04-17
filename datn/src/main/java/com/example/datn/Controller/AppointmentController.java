package com.example.datn.Controller;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.datn.Domain.request.AppointmentRequestDTO;
import com.example.datn.Service.AppointmentService;
import com.example.datn.Utils.enums.AppointmentStatus;

@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // Đặt lịch mới
    @PostMapping
    public ResponseEntity<?> create(@RequestBody AppointmentRequestDTO dto) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName(); // lấy email từ JWT
        return ResponseEntity.ok(appointmentService.create(dto, email));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyAppointments() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return ResponseEntity.ok(appointmentService.getByPatient(email));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return ResponseEntity.ok(appointmentService.cancel(id, email));
    }

    // Lấy lịch của bác sĩ đang đăng nhập
    @GetMapping("/doctor")
    public ResponseEntity<?> getDoctorAppointments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(appointmentService.getByDoctor(email));
    }

    // Xác nhận lịch
    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirm(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(appointmentService.confirm(id, email));
    }

    // Đánh dấu đã khám xong
    @PutMapping("/{id}/done")
    public ResponseEntity<?> done(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(appointmentService.markDone(id, email));
    }

    @GetMapping("/booked-slots")
    public ResponseEntity<?> getBookedSlots(
            @RequestParam Long doctorId,
            @RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(appointmentService.getBookedSlots(doctorId, localDate));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<?> getStatus(@PathVariable Long id) {
        AppointmentStatus status = appointmentService.getStatus(id);
        return ResponseEntity.ok(Map.of("status", status.name()));
    }

    @GetMapping("/doctor/done")
    public ResponseEntity<?> getDonePatients() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(appointmentService.getDoneByDoctor(email));
    }
}