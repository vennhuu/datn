package com.example.datn.Domain.response.doctor;

import java.util.Date;

import com.example.datn.Domain.Role;
import com.example.datn.Utils.enums.Degree;
import com.example.datn.Utils.enums.Gender;
import com.example.datn.Utils.enums.Specialization;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResDoctor {
    private Long id ;
    private String name ;
    private String email ;
    private Gender gender ;
    private Date birthday;
	private String address;
	private String mobile;
	private String about;
    private Role role ;

    private Specialization specialization;
    private Degree degree;
    private String hospital;
    private String experienceYears;
    private String bio;
}
