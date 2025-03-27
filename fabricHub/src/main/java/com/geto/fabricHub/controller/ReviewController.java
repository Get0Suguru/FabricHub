package com.geto.fabricHub.controller;

import com.geto.fabricHub.dto.ReviewReq;
import com.geto.fabricHub.exception.ProductException;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.Review;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.service.ReviewService;
import com.geto.fabricHub.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    private ReviewService reviewService;
    private UserService userService;

    public ReviewController(ReviewService reviewService, UserService userService) {
        this.reviewService = reviewService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<Review> createReview(@RequestHeader("Authorization") String authHeader,
                                               @RequestBody ReviewReq req) throws UserException, ProductException{

        User user = userService.findUserProfileByJwt(authHeader);
        Review review = reviewService.createReview(req, user);

        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }

    @GetMapping("/product/{prodId}")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable("prodId") Long productId) throws ProductException {
        List<Review> reviews = reviewService.getAllReview(productId);
        return new ResponseEntity<>(reviews, HttpStatus.ACCEPTED);
    }
}
