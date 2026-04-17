package com.example.datn.Service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã xác thực đăng ký tài khoản");
        message.setText("Mã xác thực của bạn là: " + code + "\nMã có hiệu lực trong 5 phút.");
        mailSender.send(message);
    }

    public void sendAppointmentConfirmation(
            String toEmail,
            String patientName,
            String doctorName,
            String hospitalName,
            String date,
            String timeSlot,
            String price) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("✅ Xác nhận đặt lịch khám thành công");
        message.setText(
            "Xin chào " + patientName + ",\n\n" +
            "Bạn đã đặt lịch khám thành công. Thông tin chi tiết:\n\n" +
            "👨‍⚕️ Bác sĩ     : " + doctorName + "\n" +
            "🏥 Bệnh viện  : " + hospitalName + "\n" +
            "📅 Ngày khám  : " + date + "\n" +
            "🕐 Giờ khám   : " + timeSlot + "\n" +
            "💰 Giá khám   : " + price + "\n\n" +
            "Vui lòng đến đúng giờ. Cảm ơn bạn đã sử dụng dịch vụ!\n\n" +
            "Trân trọng,\nHệ thống HSSK"
        );
        mailSender.send(message);
    }

    public void sendMedicalRecord(String toEmail, String patientName,
            String doctorName, String date, String diagnosis,
            String symptoms, String prescription, String notes, String revisitDate) {

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(toEmail);
        mail.setSubject("Bệnh án sau khám - " + date);
        mail.setText(
            "Xin chào " + patientName + ",\n\n" +
            "Bác sĩ " + doctorName + " đã gửi bệnh án ngày " + date + ":\n\n" +
            "🔹 Chẩn đoán: " + diagnosis + "\n" +
            "🔹 Triệu chứng: " + (symptoms != null ? symptoms : "—") + "\n" +
            "🔹 Đơn thuốc: " + (prescription != null ? prescription : "—") + "\n" +
            "🔹 Ghi chú: " + (notes != null ? notes : "—") + "\n" +
            "🔹 Ngày tái khám: " + (revisitDate != null ? revisitDate : "Không có") + "\n\n" +
            "Chúc bạn mau khỏe!\nPhuocBooking"
        );
        mailSender.send(mail);
    }
}