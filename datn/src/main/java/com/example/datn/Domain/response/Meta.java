package com.example.datn.Domain.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Meta {
    private int currentPage ;
    private int pageSize ;
    private long totalElements ;
    private int totalPages ;

}
