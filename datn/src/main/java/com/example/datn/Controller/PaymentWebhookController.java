package com.example.datn.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.datn.Service.AppointmentService;

@RestController
@RequestMapping("/api/v1/webhook")
public class PaymentWebhookController {

    private final AppointmentService appointmentService;

    @Value("${sepay.api-token}")
    private String sepayToken;

    public PaymentWebhookController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/sepay")
    public ResponseEntity<Map<String, Object>> handleSepay(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "X-API-Key", required = false) String apiKeyHeader) {

        try {
            String content = String.valueOf(payload.get("content"));
            String transferType = String.valueOf(payload.get("transferType"));

            if (!"in".equals(transferType)) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Ignored"));
            }

            if (content == null || !content.toUpperCase().contains("KHAM")) {
                return ResponseEntity.ok(Map.of("success", true, "message", "No KHAM keyword"));
            }

            // Regex tìm orderCode
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("KHAM\\s*(\\d+)", 
                    java.util.regex.Pattern.CASE_INSENSITIVE);
            java.util.regex.Matcher matcher = pattern.matcher(content);

            if (matcher.find()) {
                long orderCode = Long.parseLong(matcher.group(1));

                appointmentService.confirmByOrderCode(orderCode);

                return ResponseEntity.ok(Map.of("success", true, "message", "Confirmed"));
            } else {
                return ResponseEntity.ok(Map.of("success", true, "message", "Cannot extract orderCode"));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("success", false, "message", "Error: " + e.getMessage()));
        }
    }
}