package com.example.datn.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.datn.Domain.request.MedicalRecordRequestDTO;
import com.example.datn.Service.MedicalRecordService;

@RestController
@RequestMapping("/api/v1/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> send(@RequestBody MedicalRecordRequestDTO dto) {
        medicalRecordService.send(dto);
        return ResponseEntity.ok().build();
    }
}