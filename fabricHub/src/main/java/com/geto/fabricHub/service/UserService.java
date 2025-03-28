package com.geto.fabricHub.service;

import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.User;

public interface UserService {

    public User findUserProfileByJwt(String jwtToken) throws UserException;
}
