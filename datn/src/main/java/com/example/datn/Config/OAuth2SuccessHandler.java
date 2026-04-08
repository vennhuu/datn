package com.example.datn.Config;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.datn.Domain.User;
import com.example.datn.Domain.response.ResLoginDTO;
import com.example.datn.Repository.UserRepository;
import com.example.datn.Utils.SecurityUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;

    public OAuth2SuccessHandler(UserRepository userRepository, SecurityUtil securityUtil) {
        this.userRepository = userRepository;
        this.securityUtil = securityUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        User user = userRepository.findByEmail(email);

        // Tạo ResLoginDTO để generate token
        ResLoginDTO res = new ResLoginDTO();
        ResLoginDTO.RoleDTO roleDTO = new ResLoginDTO.RoleDTO(
            user.getRole().getId(),
            user.getRole().getName()
        );
        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
            user.getId(),
            user.getName(),
            user.getEmail(),
            roleDTO,
            user.getAvatar()
        );
        res.setUser(userLogin);

        // Tạo access token
        String accessToken = securityUtil.createAccessToken(email, res);

        // Tạo refresh token + lưu vào DB
        String refreshToken = securityUtil.createRefreshToken(email, res);
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        // Set refresh token vào cookie
        ResponseCookie cookie = ResponseCookie
            .from("refresh_token", refreshToken)
            .httpOnly(true)
            .secure(false) // true nếu dùng HTTPS
            .path("/")
            .maxAge(7 * 24 * 60 * 60)
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // redirect về frontend kèm access token
        String redirectUrl = "http://localhost:5173/oauth2/callback?token=" + accessToken
            + "&name=" + URLEncoder.encode(user.getName(), StandardCharsets.UTF_8)
            + "&email=" + user.getEmail()
            + "&avatar=" + URLEncoder.encode(user.getAvatar() != null ? user.getAvatar() : "", StandardCharsets.UTF_8)
            + "&id=" + user.getId()
            + "&role=" + user.getRole().getName();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}