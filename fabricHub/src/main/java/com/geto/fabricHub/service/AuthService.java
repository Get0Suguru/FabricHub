package com.geto.fabricHub.service;

import com.geto.fabricHub.dto.UserDTO;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.User;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    public String verifyUser(UserDTO loginObj, HttpServletResponse response) throws UserException;

    public void registerUser(UserDTO userObj) throws UserException;

    public void logoutUser(String jwtToken, HttpServletResponse response ) throws UserException;
}
