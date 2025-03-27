package com.geto.fabricHub.controller;

import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// this it to get user info - > by the user ofc

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

//    todo -> u must not send the direct user model Obj (that have password as well)
//     so make and send the dto    # will do it

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfileHandler(
            @CookieValue("jwtToken") String jwtToken) throws UserException{

        User user = userService.findUserProfileByJwt(jwtToken);

        return new ResponseEntity<>(user,HttpStatus.ACCEPTED);

    }
}
