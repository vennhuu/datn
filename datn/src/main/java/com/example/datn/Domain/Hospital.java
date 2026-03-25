package com.example.datn.Domain;

import java.util.List;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.example.datn.Utils.enums.City;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name ="hospitals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Hospital {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id ;

    private String name ;
    private String address ;

    @Enumerated(EnumType.STRING)
    @NotNull(message="Vui lòng chọn thành phố")
    private City city ;
    private String introduction ;
    private String logo ;
    private Double rating ;

    @OneToMany(mappedBy="hospital")
    @JsonIgnore
    private List<Doctor> doctors;
}
