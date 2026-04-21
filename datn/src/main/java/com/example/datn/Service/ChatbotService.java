package com.example.datn.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.datn.Domain.Doctor;
import com.example.datn.Repository.DoctorRepository;
import com.example.datn.Utils.enums.Specialization;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ChatbotService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DoctorRepository doctorRepository;

    public ChatbotService(RestTemplate restTemplate, DoctorRepository doctorRepository) {
        this.restTemplate = restTemplate;
        this.doctorRepository = doctorRepository;
    }

    public String chat(String userMessage) {
        String url = "https://api.groq.com/openai/v1/chat/completions";

        String dbContext = buildContext();

        String safeMessage = userMessage
            .replace("\\", "\\\\")
            .replace("\"", "\\\"");

        String systemPrompt = """
            Bạn là trợ lý đặt lịch khám bệnh trực tuyến.

            THÔNG TIN THỰC TẾ TỪ HỆ THỐNG:
            %s

            QUY TẮC:
            - Chỉ trả lời các câu hỏi liên quan đến: đặt lịch khám, bác sĩ, chuyên khoa, bệnh viện, giá khám, triệu chứng bệnh.
            - Nếu người dùng hỏi NGOÀI các chủ đề trên, hãy lịch sự từ chối và hướng về đúng chủ đề.
            - Chỉ dùng thông tin có trong hệ thống ở trên, KHÔNG bịa thêm bác sĩ hay thông tin nào khác.
            - Nếu không có thông tin phù hợp hãy nói: "Hiện tại chưa có thông tin về vấn đề này".
            - Trả lời ngắn gọn, thân thiện bằng tiếng Việt.
            - Khi giới thiệu bác sĩ nêu rõ: tên, chuyên khoa, bệnh viện, thành phố, giá khám.
            """.formatted(dbContext);

        String body = """
            {
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {
                        "role": "system",
                        "content": "%s"
                    },
                    {
                        "role": "user",
                        "content": "%s"
                    }
                ],
                "max_tokens": 1024
            }
            """.formatted(
                systemPrompt.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n"),
                safeMessage
            );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                url, new HttpEntity<>(body, headers), String.class
            );
            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("choices").get(0)
                       .path("message").path("content")
                       .asText("Xin lỗi, tôi không hiểu câu hỏi này.");
        } catch (Exception e) {
            e.printStackTrace();
            return "Xin lỗi, có lỗi xảy ra: " + e.getMessage();
        }
    }

    private String buildContext() {
        StringBuilder context = new StringBuilder();

        // Load hết bác sĩ — AI tự lọc theo câu hỏi
        List<Doctor> allDoctors = doctorRepository.findAll();
        context.append("DANH SÁCH BÁC SĨ HIỆN CÓ:\n");
        for (Doctor d : allDoctors) {
            context.append(formatDoctor(d)).append("\n");
        }

        // Danh sách chuyên khoa
        context.append("\nCÁC CHUYÊN KHOA HIỆN CÓ: ");
        for (Specialization spec : Specialization.values()) {
            context.append(spec.getDescription()).append(", ");
        }

        return context.toString();
    }

    private String formatDoctor(Doctor d) {
        String name     = d.getUser()            != null ? d.getUser().getName()                   : "N/A";
        String hospital = d.getHospital()         != null ? d.getHospital().getName()               : "N/A";
        String city     = d.getHospital()         != null ? d.getHospital().getCity().toString()    : "N/A";
        String spec     = d.getSpecialization()   != null ? d.getSpecialization().getDescription()  : "N/A";
        String degree   = d.getDegree()           != null ? d.getDegree().toString()                : "";
        String exp      = d.getExperienceYears()  != null ? d.getExperienceYears() + " năm KN"     : "";
        String price    = d.getPrice()            != null ? d.getPrice() + "đ"                     : "N/A";

        return "- %s (%s) | Chuyên khoa: %s | Bệnh viện: %s | Thành phố: %s | %s | Giá: %s"
            .formatted(name, degree, spec, hospital, city, exp, price);
    }
}