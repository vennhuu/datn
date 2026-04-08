package com.example.datn.Domain;

import java.time.Instant;
import java.time.LocalDate;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.example.datn.Utils.enums.AppointmentStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "appointments")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private User patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private LocalDate appointmentDate;   // ngày khám
    private String timeSlot;             // "09:00 - 09:30"

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;    // PENDING, CONFIRMED, CANCELLED, DONE

    private String note;                 // ghi chú của bệnh nhân
    private Double price;

    private Long orderCode;        // timestamp unique, dùng để đối soát
    private String paymentContent; // nội dung CK: "KHAM {orderCode}"

    @CreatedDate
    private Instant createdAt;
}
