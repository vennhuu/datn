package com.example.datn.Domain.response;

import java.util.Date;

import com.example.datn.Utils.enums.Gender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResRegisterDTO {
    
    private String name ; 
    private String email ;
    private Gender gender ;
    private String phoneNumber ;
    private Date birth ;
    private String address ;
    private String avatar ;
}
