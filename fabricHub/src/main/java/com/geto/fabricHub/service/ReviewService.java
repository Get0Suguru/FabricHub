package com.geto.fabricHub.service;

import com.geto.fabricHub.dto.ReviewReq;
import com.geto.fabricHub.dto.ReviewResponse;
import com.geto.fabricHub.exception.ProductException;
import com.geto.fabricHub.model.Review;
import com.geto.fabricHub.model.User;

import java.util.List;

public interface ReviewService {

    public Review createReview(ReviewReq req, User user) throws ProductException;

    //this one is to give generic model Revie type
    public List<Review> getAllReview(long productId) throws  ProductException;
}
