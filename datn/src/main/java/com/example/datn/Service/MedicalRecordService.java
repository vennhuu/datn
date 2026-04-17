package com.example.datn.Service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.example.datn.Domain.Appointment;
import com.example.datn.Domain.MedicalRecord;
import com.example.datn.Domain.User;
import com.example.datn.Domain.request.MedicalRecordRequestDTO;
import com.example.datn.Repository.AppointmentRepository;
import com.example.datn.Repository.MedicalRecordRepository;
import com.example.datn.Repository.UserRepository;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository,
            AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            EmailService emailService) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public void send(MedicalRecordRequestDTO dto) {
        Appointment apt = appointmentRepository.findById(dto.getAppointmentId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch khám"));

        User patient = apt.getPatient();

        // Lưu bệnh án
        MedicalRecord record = MedicalRecord.builder()
            .appointment(apt)
            .patient(patient)
            .diagnosis(dto.getDiagnosis())
            .symptoms(dto.getSymptoms())
            .prescription(dto.getPrescription())
            .notes(dto.getNotes())
            .revisitDate(dto.getRevisitDate() != null
                ? LocalDate.parse(dto.getRevisitDate()) : null)
            .build();

        medicalRecordRepository.save(record);

        // Gửi email
        try {
            emailService.sendMedicalRecord(
                patient.getEmail(),
                patient.getName(),
                apt.getDoctor().getUser().getName(),
                apt.getAppointmentDate().toString(),
                dto.getDiagnosis(),
                dto.getSymptoms(),
                dto.getPrescription(),
                dto.getNotes(),
                dto.getRevisitDate()
            );
        } catch (Exception e) {
            System.err.println("Gửi mail bệnh án thất bại: " + e.getMessage());
        }
    }
}