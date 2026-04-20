package com.example.datn.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.datn.Domain.Appointment;
import com.example.datn.Domain.Doctor;
import com.example.datn.Domain.User;
import com.example.datn.Utils.enums.AppointmentStatus;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientOrderByCreatedAtDesc(User patient);

    boolean existsByDoctorAndAppointmentDateAndTimeSlot(
            Doctor doctor, LocalDate date, String timeSlot);

    List<Appointment> findByDoctorOrderByAppointmentDateDescCreatedAtDesc(Doctor doctor);

    List<Appointment> findByDoctorAndAppointmentDateAndStatusNot( Doctor doctor, LocalDate date, AppointmentStatus status);

    Optional<Appointment> findByOrderCode(Long orderCode);

    // Dùng cho getBookedSlots (hiển thị slot đã khóa trên UI)
    List<Appointment> findByDoctorAndAppointmentDateAndStatusIn(
        Doctor doctor,
        LocalDate date,
        List<AppointmentStatus> statuses
    );

    // Dùng cho kiểm tra conflict khi đặt lịch
    boolean existsByDoctorAndAppointmentDateAndTimeSlotAndStatusIn(
        Doctor doctor,
        LocalDate date,
        String timeSlot,
        List<AppointmentStatus> statuses
    );

    List<Appointment> findByDoctorAndStatusOrderByAppointmentDateDesc(Doctor doctor, AppointmentStatus status);

    long countByStatus(AppointmentStatus status);

    List<Appointment> findAllByOrderByCreatedAtDesc();
}
