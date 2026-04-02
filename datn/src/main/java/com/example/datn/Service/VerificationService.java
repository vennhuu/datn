package com.example.datn.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class VerificationService {

    // Lưu tạm: email → {code, expireTime}
    private final Map<String, String[]> store = new ConcurrentHashMap<>();

    // Tạo và lưu mã 6 số
    public String generateCode(String email) {
        String code = String.valueOf((int)(Math.random() * 900000) + 100000);
        String expireAt = String.valueOf(System.currentTimeMillis() + 5 * 60 * 1000); // 5 phút
        store.put(email, new String[]{code, expireAt});
        return code;
    }

    // Kiểm tra mã hợp lệ không
    public boolean verifyCode(String email, String code) {
        String[] data = store.get(email);
        if (data == null) return false;

        boolean isExpired = System.currentTimeMillis() > Long.parseLong(data[1]);
        if (isExpired) {
            store.remove(email);
            return false;
        }

        boolean isMatch = data[0].equals(code);
        if (isMatch) store.remove(email); // Dùng xong xóa luôn
        return isMatch;
    }
}