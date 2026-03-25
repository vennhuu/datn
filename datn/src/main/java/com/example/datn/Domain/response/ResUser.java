package com.example.datn.Domain.response;

import java.util.Date;

import com.example.datn.Domain.Role;
import com.example.datn.Utils.enums.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
    @NotBlank(message ="Không được để trống tên")
    private String name ;

    @NotBlank(message ="Không được để trống email")
    @Email(message="Email không đúng định dạng")
    private String email ;
    
    @NotNull(message="Vui lòng nhập giới tính")
    private Gender gender ;
    private Date birthday;
	private String address;

    @Pattern(regexp = "^[0-9]+$", message = "Số điện thoại chỉ được chứa số")
    @Size(max = 11 , message="Số điện thoại tối đa 11 số")
	private String mobile;
	private String about;
    private Role role ;
    private String avatar ;
}
