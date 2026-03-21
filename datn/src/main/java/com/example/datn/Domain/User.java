package com.example.datn.Domain;

import java.time.LocalDateTime;
import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.example.datn.Utils.enums.Gender;

import jakarta.persistence.Column;
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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name ="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id ;

    @NotBlank(message ="Không được để trống tên")
    private String name ;

    @NotBlank(message ="Không được để trống email")
    private String email ;

    @NotBlank(message ="Không được để trống mật khẩu")
    private String password ;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", columnDefinition = "VARCHAR(10)")
    private Gender gender ;

    private Date birthday;

    @Size(max = 100)
	private String address;

	@Pattern(regexp = "^[0-9]+$", message = "Số điện thoại chỉ được chứa số")
    @Size(max = 20)
	private String mobile;

	@Column(columnDefinition = "TEXT")
	private String about;

    @ManyToOne
    @JoinColumn(name="role_id", nullable=false)
    private Role role;

    @CreatedDate
    @Column(nullable = false, updatable = false) 
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
