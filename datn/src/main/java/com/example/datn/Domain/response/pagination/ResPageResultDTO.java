package com.example.datn.Domain.response.pagination;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResPageResultDTO {
    private Meta meta ;
    private Object result ;
}
