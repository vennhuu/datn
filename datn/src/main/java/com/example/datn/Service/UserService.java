package com.example.datn.Service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.datn.Domain.Role;
import com.example.datn.Domain.User;
import com.example.datn.Domain.response.Meta;
import com.example.datn.Domain.response.ResPageResultDTO;
import com.example.datn.Domain.response.ResUser;
import com.example.datn.Repository.RoleRepository;
import com.example.datn.Repository.UserRepository;

@Service
public class UserService {
    
    private final UserRepository userRepository ;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository ;

    public UserService(UserRepository userRepository , PasswordEncoder passwordEncoder , RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder ;
        this.roleRepository = roleRepository ;
    }

    public User save(User user) {
        return this.userRepository.save(user) ;
    }

    public boolean existEmail ( String email ) {
        return this.userRepository.existsByEmail(email ) ;
    }

    public List<ResUser> getAllUsers() {
        return this.userRepository.findAll(Sort.by(Sort.Direction.ASC, "id"))
                .stream()
                .map(this::convertUserToResUser)
                .collect(Collectors.toList()) ;
    }

    public User updateUser(Long id, User user) {
        User existingUser = this.userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        existingUser.setEmail(user.getEmail());
        existingUser.setName(user.getName());

        if (user.getRole() != null) {
            existingUser.setRole(user.getRole());
        }

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            String hashPassword = this.passwordEncoder.encode(user.getPassword());
            existingUser.setPassword(hashPassword);
    }

        return this.userRepository.save(existingUser);
    }

    public void deleteUser ( User user ) {
        this.userRepository.delete(user);
    }

    public User findById( long id ) {
        Optional<User> optionalUser = this.userRepository.findById(id) ;
        if ( optionalUser.isPresent() ) {
            return optionalUser.get() ;
        }
        return null ;
    }

    public Role setRole( User user ) {
        return this.roleRepository.findById((long) 3).orElseThrow();
    }

    public ResUser convertUserToResUser( User user ) {
        ResUser resUser = new ResUser() ;
        resUser.setId(user.getId());
        resUser.setName(user.getName());
        resUser.setEmail(user.getEmail());
        resUser.setRole(user.getRole());
        return resUser ;
    }

    public ResPageResultDTO fetchAllUsers( int currentPage , int pageSize , Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAll(pageable) ;

        ResPageResultDTO res = new ResPageResultDTO() ;

        Meta meta = new Meta() ;
        meta.setCurrentPage(currentPage);
        meta.setPageSize(pageSize);
        meta.setTotalElements( pageUser.getTotalElements());
        meta.setTotalPages( pageUser.getTotalPages());

        res.setMeta(meta);

        List<ResUser> listResUsers = pageUser.getContent()
                    .stream()
                    .map(item -> this.convertUserToResUser(item))
                    .collect(Collectors.toList());
        res.setResult(listResUsers);

        return res;
    }
}