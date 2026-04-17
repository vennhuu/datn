package com.example.datn.Domain.request;

import lombok.Data;

@Data
public class MedicalRecordRequestDTO {
    private Long appointmentId;
    private Long patientId;
    private String diagnosis;
    private String symptoms;
    private String prescription;
    private String notes;
    private String revisitDate; // "YYYY-MM-DD"
}