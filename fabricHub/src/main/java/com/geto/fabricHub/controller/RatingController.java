package com.geto.fabricHub.controller;

import com.geto.fabricHub.dto.RatingReq;
import com.geto.fabricHub.exception.ProductException;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.Rating;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.service.RatingService;
import com.geto.fabricHub.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private UserService userService;
    private RatingService ratingService;

    public RatingController(UserService userService, RatingService ratingService) {
        this.userService = userService;
        this.ratingService = ratingService;
    }

    @PostMapping("/create")
    public ResponseEntity<Rating> createRating(@RequestBody RatingReq req,
                                               @RequestHeader("Authorization") String authHeader)
            throws UserException, ProductException{

        User user = userService.findUserProfileByJwt(authHeader);
        Rating rating = ratingService.createRating(req, user);

        return new ResponseEntity<>(rating, HttpStatus.CREATED);
    }

    @GetMapping("/product/{prodId}")
    public ResponseEntity<List<Rating>> getProductRatings(@PathVariable("prodId") Long prodId){

        List<Rating> ratings = ratingService.getAllRatings(prodId);
        return new ResponseEntity<>(ratings, HttpStatus.ACCEPTED );
    }


}
