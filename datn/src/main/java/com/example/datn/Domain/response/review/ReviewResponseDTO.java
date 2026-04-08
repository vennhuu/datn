package com.example.datn.Domain.response.review;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewResponseDTO {
    private Long id;
    private String userName;
    private String userAvatar;
    private Integer rating;
    private String comment;
}