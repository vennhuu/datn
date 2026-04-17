package com.example.datn.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.datn.Domain.Appointment;
import com.example.datn.Domain.Doctor;
import com.example.datn.Domain.User;
import com.example.datn.Domain.request.AppointmentRequestDTO;
import com.example.datn.Domain.response.appointment.AppointmentResponseDTO;
import com.example.datn.Repository.AppointmentRepository;
import com.example.datn.Repository.DoctorRepository;
import com.example.datn.Repository.UserRepository;
import com.example.datn.Utils.enums.AppointmentStatus;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public AppointmentService(AppointmentRepository appointmentRepository, DoctorRepository doctorRepository,
            UserRepository userRepository , EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.emailService = emailService ;
    }

    public AppointmentResponseDTO create(AppointmentRequestDTO dto, String email) {
        User patient = userRepository.findByEmail(email);

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        boolean conflict = appointmentRepository
                .existsByDoctorAndAppointmentDateAndTimeSlotAndStatusIn(
                        doctor,
                        dto.getAppointmentDate(),
                        dto.getTimeSlot(),
                        List.of(AppointmentStatus.CONFIRMED, AppointmentStatus.DONE) // ✅ Bỏ PENDING
                );
        if (conflict) throw new RuntimeException("Khung giờ này đã được đặt");

        // Tạo mã đối soát unique
        long orderCode = System.currentTimeMillis() % 100_000_000L;
        String paymentContent = "KHAM " + orderCode;

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(dto.getAppointmentDate())
                .timeSlot(dto.getTimeSlot())
                .note(dto.getNote())
                .price(doctor.getPrice())
                .status(AppointmentStatus.PENDING)
                .orderCode(orderCode)
                .paymentContent(paymentContent)
                .build();

        appointmentRepository.save(appointment);

        return toDTO(appointment);
    }

    public List<AppointmentResponseDTO> getByPatient(String email) {
        User patient = userRepository.findByEmail(email);
        return appointmentRepository.findByPatientOrderByCreatedAtDesc(patient)
                .stream().map(this::toDTO).toList();
    }

    public AppointmentResponseDTO cancel(Long id, String email) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch"));

        if (!apt.getPatient().getEmail().equals(email))
            throw new RuntimeException("Không có quyền hủy lịch này");

        apt.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(apt);
        return toDTO(apt);
    }

    public AppointmentResponseDTO toDTO(Appointment a) {
        return AppointmentResponseDTO.builder()
                .id(a.getId())
                .patientName(a.getPatient().getName())
                .patientEmail(a.getPatient().getEmail())
                .patientPhone(a.getPatient().getMobile())
                .doctorName(a.getDoctor().getUser().getName())
                .hospitalName(a.getDoctor().getHospital().getName())
                .appointmentDate(a.getAppointmentDate())
                .timeSlot(a.getTimeSlot())
                .status(a.getStatus())
                .price(a.getPrice())
                .note(a.getNote())
                .createdAt(a.getCreatedAt())
                .orderCode(a.getOrderCode())
                .paymentContent(a.getPaymentContent())
                .build();
    }

    public List<AppointmentResponseDTO> getByDoctor(String email) {
        User user = userRepository.findByEmail(email);
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return appointmentRepository.findByDoctorOrderByAppointmentDateDescCreatedAtDesc(doctor)
                .stream().map(this::toDTO).toList();
    }

    public AppointmentResponseDTO confirm(Long id, String email) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch"));
        apt.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(apt);
        return toDTO(apt);
    }

    public AppointmentResponseDTO markDone(Long id, String email) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch"));
        apt.setStatus(AppointmentStatus.DONE);
        appointmentRepository.save(apt);
        return toDTO(apt);
    }

    public List<String> getBookedSlots(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return appointmentRepository
                .findByDoctorAndAppointmentDateAndStatusIn(
                        doctor, date,
                        List.of(AppointmentStatus.CONFIRMED, AppointmentStatus.DONE))
                .stream()
                .map(Appointment::getTimeSlot)
                .toList();
        }
        public void confirmByOrderCode(long orderCode) {
        Appointment apt = appointmentRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch với orderCode: " + orderCode));

        if (apt.getStatus() == AppointmentStatus.CONFIRMED) return; // Idempotent

        apt.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(apt);

        // Gửi mail sau khi thanh toán thành công
        try {
            Doctor doctor = apt.getDoctor();
            emailService.sendAppointmentConfirmation(
                    apt.getPatient().getEmail(),
                    apt.getPatient().getName(),
                    doctor.getUser().getName(),
                    doctor.getHospital().getName(),
                    apt.getAppointmentDate().toString(),
                    apt.getTimeSlot(),
                    apt.getPrice() != null
                            ? String.format("%,.0f VNĐ", apt.getPrice())
                            : "Liên hệ");
        } catch (Exception e) {
            System.err.println("Gửi mail thất bại: " + e.getMessage());
        }
    }

    // Thêm method lấy status cho frontend polling
    public AppointmentStatus getStatus(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch"))
                .getStatus();
    }

    public List<AppointmentResponseDTO> getDoneByDoctor(String email) {
        User user = userRepository.findByEmail(email);
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return appointmentRepository
                .findByDoctorAndStatusOrderByAppointmentDateDesc(doctor, AppointmentStatus.DONE)
                .stream().map(this::toDTO).toList();
        }
    
}