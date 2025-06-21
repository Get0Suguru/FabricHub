package com.geto.fabricHub.service;

import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.repo.UserRepo;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImplementation implements UserService{

    private JWTService jwtService;
    private UserRepo userRepo;

    public UserServiceImplementation(JWTService jwtService, UserRepo userRepo) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }

    @Override
    public User findUserProfileByJwt(String jwtToken) throws UserException {

        String email = jwtService.extractEmail(jwtToken);
        return userRepo.findByEmail(email);
    }
}
