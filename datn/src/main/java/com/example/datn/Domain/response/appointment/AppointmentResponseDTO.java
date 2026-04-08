package com.example.datn.Domain.response.appointment;

import java.time.Instant;
import java.time.LocalDate;

import com.example.datn.Utils.enums.AppointmentStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AppointmentResponseDTO {
    private Long id;
    // patient
    private String patientName;
    private String patientEmail;
    private String patientPhone;

    // doctor 
    private String doctorName;
    private String hospitalName;
    private LocalDate appointmentDate;
    private String timeSlot;
    private AppointmentStatus status;
    private Double price;
    private String note;
    private Instant createdAt;

    private Long orderCode;
    private String paymentContent;
}