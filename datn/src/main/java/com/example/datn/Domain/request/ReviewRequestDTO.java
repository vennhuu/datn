package com.example.datn.Domain.request;

import lombok.Data;

@Data
public class ReviewRequestDTO {
    private Long doctorId;
    private Integer rating;
    private String comment;
}