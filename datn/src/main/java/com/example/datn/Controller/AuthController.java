package com.example.datn.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.datn.Domain.User;
import com.example.datn.Domain.request.ReqLoginDTO;
import com.example.datn.Domain.response.ResLoginDTO;
import com.example.datn.Domain.response.ResUser;
import com.example.datn.Service.EmailService;
import com.example.datn.Service.UserService;
import com.example.datn.Service.VerificationService;
import com.example.datn.Utils.SecurityUtil;
import com.example.datn.Utils.annotation.APIMessage;
import com.example.datn.Utils.errors.InvalidException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    private final UserService userService ;
    private final AuthenticationManagerBuilder authenticationManagerBuilder ;
    private final SecurityUtil securityUtil ;
    private final EmailService emailService;
    private final VerificationService verificationService;

    public AuthController(
            UserService userService ,
            AuthenticationManagerBuilder authenticationManagerBuilder ,
            SecurityUtil securityUtil ,
            EmailService emailService ,
            VerificationService verificationService
         ) {
        this.userService = userService;
        this.authenticationManagerBuilder = authenticationManagerBuilder ;
        this.securityUtil = securityUtil ;
        this.emailService = emailService ;
        this.verificationService = verificationService ;
    }

    @Value("${venn.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration ;

    @PostMapping("/auth/send-code")
    public ResponseEntity<String> sendCode(@RequestParam String email) throws InvalidException {
        if (this.userService.existEmail(email)) {
            throw new InvalidException("Email đã tồn tại");
        }
        String code = verificationService.generateCode(email);
        emailService.sendVerificationCode(email, code);
        return ResponseEntity.ok("Đã gửi mã xác thực");
    }

    @PostMapping("/auth/verify-code")
    public ResponseEntity<String> verifyCode(
            @RequestParam String email,
            @RequestParam String code) throws InvalidException {
        boolean isValid = verificationService.verifyCode(email, code);
        if (!isValid) {
            throw new InvalidException("Mã xác thực không đúng hoặc đã hết hạn");
        }
        return ResponseEntity.ok("Xác thực thành công");
    }
    @PostMapping("/register")
    public ResponseEntity<ResUser> register(@RequestBody User postManUser) throws InvalidException {
        if ( this.userService.existEmail(postManUser.getEmail())) {
            throw new InvalidException("Email đã tồn tại") ;
        }

        User savedUser = this.userService.createUser(postManUser);

        ResUser res = this.userService.convertUserToResUser(savedUser) ;
        return ResponseEntity.status(HttpStatus.CREATED).body(res) ;
    }


    @PostMapping("/login")
    public ResponseEntity<ResLoginDTO> login( @Valid @RequestBody ReqLoginDTO loginDTO) {
        
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginDTO.getUsername() , loginDTO.getPassword()) ;
        
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken) ;

        User currentUser = this.userService.findByEmail(loginDTO.getUsername()) ;

        SecurityContextHolder.getContext().setAuthentication(authentication);

        ResLoginDTO res = new ResLoginDTO() ;

        ResLoginDTO.RoleDTO roleDTO = new ResLoginDTO.RoleDTO(
            currentUser.getRole().getId(),
            currentUser.getRole().getName()
        );

        ResLoginDTO.UserLogin user = new ResLoginDTO.UserLogin(currentUser.getId() , currentUser.getName() , currentUser.getEmail() , roleDTO , currentUser.getAvatar()) ;
        res.setUser(user);

        // create token
        String access_token = this.securityUtil.createAccessToken(loginDTO.getUsername() , res);
        res.setAccessToken(access_token);

        // create refreshtoken
        String refresh_token = this.securityUtil.createRefreshToken(loginDTO.getUsername(), res) ;

        // update user 
        this.userService.updateUserToken(refresh_token, loginDTO.getUsername());

        // set cookies
        ResponseCookie resCookies = ResponseCookie
            .from("refresh_token" , refresh_token)
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(refreshTokenExpiration)
            .build() ;
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, resCookies.toString())
            .body(res);
    }
    

    @GetMapping("/auth/account")
    public ResponseEntity<ResLoginDTO.UserGetAccount> getMethodName() {

        String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "" ;

        User currentUserDB = this.userService.findByEmail(email);
        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
        ResLoginDTO.UserGetAccount userGetAccount = new ResLoginDTO.UserGetAccount();
        ResLoginDTO.RoleDTO roleDTO = new ResLoginDTO.RoleDTO(
            currentUserDB.getRole().getId(),
            currentUserDB.getRole().getName()
        );

        if (currentUserDB != null) {
            userLogin.setId(currentUserDB.getId());
            userLogin.setEmail(currentUserDB.getEmail());
            userLogin.setName(currentUserDB.getName());
            userLogin.setRole(roleDTO);
            userLogin.setAvatar(currentUserDB.getAvatar());

            userGetAccount.setUser(userLogin);
        }

        return ResponseEntity.ok().body(userGetAccount);
    }
    
    @GetMapping("/auth/refresh")
    @APIMessage("Get user by refresh token")
    public ResponseEntity<ResLoginDTO> getRefreshToken( 
            @CookieValue(name = "refresh_token", defaultValue = "abc") String refresh_token) throws InvalidException {
        if (refresh_token.equals("abc")) {
            throw new InvalidException("Bạn không có refresh token ở cookie");
        }
        // check valid
        Jwt decodedToken = this.securityUtil.checkValidRefreshToken(refresh_token);
        String email = decodedToken.getSubject();

        // check user by token + email
        User currentUser = this.userService.getUserByRefreshTokenAndEmail(refresh_token, email);
        if (currentUser == null) {
            throw new InvalidException("Refresh Token không hợp lệ");
        }

        // issue new token/set refresh token as cookies
        ResLoginDTO res = new ResLoginDTO();
        User currentUserDB = this.userService.findByEmail(email);
        ResLoginDTO.RoleDTO roleDTO = new ResLoginDTO.RoleDTO(
            currentUser.getRole().getId(),
            currentUser.getRole().getName()
        );
        if (currentUserDB != null) {
            ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(
                    currentUserDB.getId(),
                    currentUserDB.getName(),
                    currentUserDB.getEmail(),
                    roleDTO , 
                    currentUser.getAvatar()
            );
            res.setUser(userLogin);
        }

        // create access token
        String access_token = this.securityUtil.createAccessToken(email, res);
        res.setAccessToken(access_token);

        // create refresh token
        String new_refresh_token = this.securityUtil.createRefreshToken(email, res);

        // update user
        this.userService.updateUserToken(new_refresh_token, email);

        // set cookies
        ResponseCookie resCookies = ResponseCookie
                .from("refresh_token", new_refresh_token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookies.toString())
                .body(res);
    }

    @PostMapping("/auth/logout")
    @APIMessage("Logout User")
    public ResponseEntity<Void> logout() throws InvalidException {
        String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";

        if (email.equals("")) {
            throw new InvalidException("Access Token không hợp lệ");
        }

        // update refresh token = null
        this.userService.updateUserToken(null, email);

        // remove refresh token cookie
        ResponseCookie deleteSpringCookie = ResponseCookie
                .from("refresh_token", null)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteSpringCookie.toString())
                .body(null);
    }

    @PostMapping("/auth/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) throws InvalidException {
        if (!this.userService.existEmail(email)) {
            throw new InvalidException("Email không tồn tại");
        }
        String code = verificationService.generateCode(email);
        emailService.sendVerificationCode(email, code);
        return ResponseEntity.ok("Đã gửi mã xác thực");
    }

    @PostMapping("/auth/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String email,
            @RequestParam String code,
            @RequestParam String newPassword) throws InvalidException {
        boolean isValid = verificationService.verifyCode(email, code);
        if (!isValid) {
            throw new InvalidException("Mã xác thực không đúng hoặc đã hết hạn");
        }
        this.userService.resetPassword(email, newPassword);
        return ResponseEntity.ok("Đặt lại mật khẩu thành công");
    }
}
