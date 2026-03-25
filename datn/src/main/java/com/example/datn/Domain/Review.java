package com.example.datn.Domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ai đánh giá
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // đánh giá bác sĩ nào
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private Integer rating; // 1-5 sao

    @Column(columnDefinition = "TEXT")
    private String comment;
}
