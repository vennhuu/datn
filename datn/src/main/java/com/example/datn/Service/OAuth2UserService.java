package com.example.datn.Service;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.example.datn.Domain.Role;
import com.example.datn.Domain.User;
import com.example.datn.Repository.RoleRepository;
import com.example.datn.Repository.UserRepository;
import com.example.datn.Utils.enums.Gender;

@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public OAuth2UserService(UserRepository userRepository,
                              RoleRepository roleRepository,
                              PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String avatar = oAuth2User.getAttribute("picture");

        // Nếu chưa có account thì tự tạo
        User user = userRepository.findByEmail(email);
        if (user == null) {
            Role role = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setAvatar(avatar);
            user.setRole(role);
            user.setGender(Gender.KHAC);
            // Set password random vì đăng nhập bằng Google không cần password
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            userRepository.save(user);
        }

        return oAuth2User;
    }
}