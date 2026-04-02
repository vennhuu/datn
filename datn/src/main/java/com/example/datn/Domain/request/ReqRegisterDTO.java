package com.example.datn.Domain.request;

import java.util.Date;

import com.example.datn.Utils.enums.Gender;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqRegisterDTO {

    @NotBlank(message = "Không được để trống họ và tên")
    private String name ; 

    @NotBlank(message = "Không được để trống email")
    private String email ;

    @NotBlank(message = "Không được để trống mật khẩu")
    private String password ;

    @NotBlank(message = "Vui lòng nhập xác nhận mật khẩu")
    private String confirmPassword ;

    // @NotBlank(message = "Không được để trống giới tính")
    private Gender gender ;

    private String phoneNumber ;
    private Date birth ;
    private String address ;
    private String avatar ;
}
