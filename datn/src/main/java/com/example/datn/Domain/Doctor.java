package com.example.datn.Domain;

import com.example.datn.Utils.enums.Degree;
import com.example.datn.Utils.enums.Specialization;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @MapsId  // dùng chung id với user
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private Specialization specialization; // chuyên khoa

    @Enumerated(EnumType.STRING)
    private Degree degree;

    @Pattern(regexp = "^[0-9]+$", message = "Số năm kinh nghiệm phải là chữ số")
    @Size(max = 20)
    private String experienceYears;

    private String hospital;

    @Column(columnDefinition = "TEXT")
    private String bio;
}
