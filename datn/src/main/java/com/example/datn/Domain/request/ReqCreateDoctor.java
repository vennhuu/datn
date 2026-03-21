package com.example.datn.Domain.request;

import java.util.Date;

import com.example.datn.Utils.enums.Degree;
import com.example.datn.Utils.enums.Gender;
import com.example.datn.Utils.enums.Specialization;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqCreateDoctor {

    private Long id;

    @NotBlank(message ="Không được để trống tên")
    private String name ;

    @NotBlank(message ="Không được để trống email")
    @Email(message=" Email phải nhập đúng định dạng")
    private String email ;
    private String password;
    private Gender gender ;
    private Date birthday;
	private String address;

    @Pattern(regexp = "^[0-9]+$", message = "Số điện thoại chỉ được chứa số")
	private String mobile;
	private String about;

    @NotBlank(message="Bắt buộc phải có chuyên khoa")
    private Specialization specialization;

    @NotBlank(message="Bắt buộc phải có học vị")
    private Degree degree;
    private String hospital;

    @Pattern(regexp = "^[0-9]+$", message = "Số năm kinh nghiệm phải là chữ số")
    private String experienceYears;
    private String bio;
}
