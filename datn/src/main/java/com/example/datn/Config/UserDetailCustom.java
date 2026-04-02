package com.example.datn.Config;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.example.datn.Service.UserService;

@Component("userDetailsService")
public class UserDetailCustom implements UserDetailsService {

    private final UserService userService ;

    public UserDetailCustom(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.example.datn.Domain.User user = this.userService.findByEmail( username ) ;

        if ( user == null ) {
            throw new UsernameNotFoundException("Email hoặc mật khẩu sai") ;
        }
        
        return new User(user.getEmail(), user.getPassword(), Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))) ;
    }
    
}
