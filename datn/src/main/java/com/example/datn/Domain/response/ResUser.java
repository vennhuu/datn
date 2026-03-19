package com.example.datn.Domain.response;

import java.util.Date;

import com.example.datn.Domain.Role;
import com.example.datn.Utils.enums.Gender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResUser {
    private Long id ;
    private String name ;
    private String email ;
    private Gender gender ;
    private Date birthday;
	private String address;
	private String mobile;
	private String about;
    private Role role ;
}
