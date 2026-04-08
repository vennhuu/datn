package com.example.datn.Domain.request;

import java.time.LocalDate;

import lombok.Data;

@Data
public class AppointmentRequestDTO {
    private Long doctorId;
    private LocalDate appointmentDate;
    private String timeSlot;
    private String note;
}