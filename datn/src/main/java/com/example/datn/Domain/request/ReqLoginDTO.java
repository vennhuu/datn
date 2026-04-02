package com.example.datn.Domain.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqLoginDTO {

    @NotBlank(message ="Không được để trống email")
    @Email(message="Email không đúng định dạng")
    private String username ;

    @NotBlank(message = "Không được để trống mật khẩu")
    private String password ;

}
