package com.example.datn.Domain.response;

import com.example.datn.Domain.Role;

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
    private Role role ;
}
