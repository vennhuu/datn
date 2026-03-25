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
import com.example.datn.Domain.response.ResUser;
import com.example.datn.Domain.response.pagination.Meta;
import com.example.datn.Domain.response.pagination.ResPageResultDTO;
import com.example.datn.Repository.DoctorRepository;
import com.example.datn.Repository.RoleRepository;
import com.example.datn.Repository.UserRepository;

@Service
public class UserService {
    
    private final UserRepository userRepository ;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository ;
    private final DoctorRepository doctorRepository;

    public UserService(
        UserRepository userRepository , 
        PasswordEncoder passwordEncoder , 
        RoleRepository roleRepository , 
        DoctorRepository doctorRepository) {
            this.userRepository = userRepository;
            this.passwordEncoder = passwordEncoder ;
            this.roleRepository = roleRepository ;
            this.doctorRepository = doctorRepository ;
    }

    public User save(User user) {
        return this.userRepository.save(user) ;
    }

    public boolean existEmail ( String email ) {
        return this.userRepository.existsByEmail(email ) ;
    }

    public boolean existId ( long id ) {
        return this.userRepository.existsById(id) ;
    }

    public List<ResUser> getAllUsers() {
        return this.userRepository.findAll(Sort.by(Sort.Direction.ASC, "id"))
                .stream()
                .map(this::convertUserToResUser)
                .collect(Collectors.toList()) ;
    }

    public User updateUser(Long id, ResUser user) {
        User existingUser = this.userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        existingUser.setEmail(user.getEmail());
        existingUser.setName(user.getName());
        existingUser.setGender(user.getGender());
        existingUser.setBirthday(user.getBirthday());
        existingUser.setAddress(user.getAddress());
        existingUser.setMobile(user.getMobile());
        existingUser.setAbout(user.getAbout());

        if (user.getRole() != null) {
            existingUser.setRole(user.getRole());
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

    public Role setRole(String roleName) {
    return roleRepository.findByName(roleName)
        .orElseThrow(() -> new RuntimeException("Role không tồn tại"));
    }

    public ResUser convertUserToResUser( User user ) {
        ResUser resUser = new ResUser() ;
        resUser.setId(user.getId());
        resUser.setName(user.getName());
        resUser.setEmail(user.getEmail());
        resUser.setGender(user.getGender());
        resUser.setBirthday(user.getBirthday());
        resUser.setAddress(user.getAddress());
        resUser.setMobile(user.getMobile());
        resUser.setAbout(user.getAbout());
        resUser.setRole(user.getRole());
        resUser.setAvatar(user.getAvatar());
        return resUser ;
    }

    public ResPageResultDTO fetchAllUsers(int currentPage, int pageSize, Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAllByRoleName("ROLE_USER", pageable); 

        ResPageResultDTO res = new ResPageResultDTO();
        Meta meta = new Meta();
        meta.setCurrentPage(currentPage);
        meta.setPageSize(pageSize);
        meta.setTotalElements(pageUser.getTotalElements());
        meta.setTotalPages(pageUser.getTotalPages());

        res.setMeta(meta);
        res.setResult(pageUser.getContent()
                .stream()
                .map(this::convertUserToResUser)
                .collect(Collectors.toList()));

        return res;
    }

    public User createUser(User user) {
        Role role = setRole("ROLE_USER");
        user.setRole(role);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        return savedUser;
    }

}