package com.example.datn.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder() ;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(c -> c.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers(
                    "/",
                    "/api/v1/login",
                    "/api/v1/register",
                    "/api/v1/users/**",
                    "/storage/**"
                ).permitAll()
                // .anyRequest().authenticated()
                .anyRequest().permitAll()
            );

        return http.build();
    }
}
