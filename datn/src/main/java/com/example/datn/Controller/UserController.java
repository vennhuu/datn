package com.example.datn.Controller;

import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.datn.Domain.User;
import com.example.datn.Domain.response.ResUser;
import com.example.datn.Domain.response.pagination.ResPageResultDTO;
import com.example.datn.Service.UserService;
import com.example.datn.Utils.annotation.APIMessage;
import com.example.datn.Utils.errors.InvalidException;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/users")
    @APIMessage("Create a new user")
    public ResponseEntity<ResUser> createNewUser(@Valid @RequestBody User user) throws InvalidException {

        if (this.userService.existEmail(user.getEmail())) {
            throw new InvalidException("Email đã tồn tại, hãy nhập email khác");
        }

        User savedUser = this.userService.createUser(user);
        ResUser res = this.userService.convertUserToResUser(savedUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/users")
    @APIMessage("Get all new user")
    public ResponseEntity<ResPageResultDTO> getAllUser(
        @RequestParam("current") Optional<String> currentOptional ,
        @RequestParam("pageSize") Optional<String>  pageSizeOptional
    ) {
        String sCurrent = currentOptional.isPresent() ? currentOptional.get() : "1" ;
        String sPageSize = pageSizeOptional.isPresent() ? pageSizeOptional.get() : "10" ;

        int currentPage = Integer.parseInt(sCurrent) ;
        int pageSize = Integer.parseInt(sPageSize) ;
        
        Pageable pageable = PageRequest.of(currentPage - 1, pageSize, Sort.by(Sort.Direction.ASC, "id")) ;

        ResPageResultDTO res = this.userService.fetchAllUsers(currentPage, pageSize, pageable) ;
        return ResponseEntity.ok(res);
    }

    @PutMapping("/users")
    @APIMessage("Update a user")
    public ResponseEntity<ResUser> updateUser( @Valid @RequestBody ResUser user) throws InvalidException {

        if ( !this.userService.existId(user.getId()) ) {
            throw new InvalidException("Không tìm thấy người dùng này") ;
        }

        User updUser = this.userService.updateUser(user.getId(), user);
        ResUser res = this.userService.convertUserToResUser(updUser);   
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/users/{id}")
    @APIMessage("Delete a user")
    public ResponseEntity<String> deleteUser(@PathVariable long id) throws InvalidException {

        User user = this.userService.findById(id);
        if (user == null) {
            throw new InvalidException("Không tồn tại người dùng này");
        }
        this.userService.deleteUser(user);
        return ResponseEntity.ok("Xóa thành công ngươi dùng");
    }

    @GetMapping("/users/{id}")
    @APIMessage("Get user by id")
    public ResponseEntity<ResUser> getUserById(@PathVariable Long id) {
        User user = this.userService.findById(id) ;
        ResUser res = this.userService.convertUserToResUser(user);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/users/avatar")
    @APIMessage("Update user avatar")
    public ResponseEntity<String> updateAvatar(
            @RequestParam Long userId,
            @RequestParam String avatar
    ) throws InvalidException {

        User user = userService.findById(userId);

        if (user == null) {
            throw new InvalidException("User không tồn tại");
        }

        user.setAvatar(avatar);

        userService.save(user);

        return ResponseEntity.ok("Avatar updated");
    }

}
