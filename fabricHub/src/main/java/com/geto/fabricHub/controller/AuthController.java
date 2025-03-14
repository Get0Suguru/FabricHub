package com.geto.fabricHub.controller;

import com.geto.fabricHub.dto.ApiResponse;
import com.geto.fabricHub.dto.UserDTO;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.service.AuthServiceImplementation;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthServiceImplementation authServiceImplementation;

    @GetMapping("/test")
    public ResponseEntity<String> controllerTest(){
        return new ResponseEntity<String>("life is shit but admin controller works like charm", HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser (@RequestBody UserDTO userObj) throws UserException {
        authServiceImplementation.registerUser(userObj);
        return new ResponseEntity<String>("user Received/ signup successfull now login to your account", HttpStatus.CREATED);
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody UserDTO loginObj, HttpServletResponse response) throws UserException {
        String msg = authServiceImplementation.verifyUser(loginObj, response);
        System.out.println(msg);

        if (msg.equals("No User Found with this email")) {
            return new ResponseEntity<>(new ApiResponse(msg, false), HttpStatus.BAD_REQUEST);
        }
        else if (msg.equals("Login successful")) {
            return new ResponseEntity<>(new ApiResponse(msg, true), HttpStatus.CREATED);
        }
        return new ResponseEntity<>(new ApiResponse(msg, false), HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@CookieValue("jwtToken") String jwtToken, HttpServletResponse response) throws UserException {
        authServiceImplementation.logoutUser(jwtToken, response);
        return new ResponseEntity<>(new ApiResponse("logout successful", true), HttpStatus.OK);

    }





}
