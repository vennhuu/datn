package com.example.datn.Domain.response.upload;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResFileUploadDTO {
    private String fileName ;
    private Instant updatedAt ;
}
