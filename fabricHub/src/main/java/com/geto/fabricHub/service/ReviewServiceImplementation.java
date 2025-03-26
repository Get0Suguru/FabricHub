package com.geto.fabricHub.service;

import com.geto.fabricHub.dto.ReviewReq;
import com.geto.fabricHub.dto.ReviewResponse;
import com.geto.fabricHub.exception.ProductException;
import com.geto.fabricHub.model.Product;
import com.geto.fabricHub.model.Review;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.repo.ProductRepo;
import com.geto.fabricHub.repo.RatingRepo;
import com.geto.fabricHub.repo.ReviewRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewServiceImplementation implements ReviewService{

    private ReviewRepo reviewRepo;
    private ProductService productService;
    private ProductRepo prodRepo;
    private RatingRepo ratingRepo;

    public ReviewServiceImplementation(ReviewRepo reviewRepo, ProductService productService, ProductRepo prodRepo) {
        this.reviewRepo = reviewRepo;
        this.productService = productService;
        this.prodRepo = prodRepo;
    }

    @Override
    public Review createReview(ReviewReq req, User user) throws ProductException {
        Product product = prodRepo.findById(req.getProductId()).orElseThrow(()-> new ProductException("product not found"));

        Review review = new Review();
        review.setProduct(product);
        review.setReview(req.getReview());
        review.setUser(user);
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepo.save(review);
    }



    @Override
    public List<Review> getAllReview(long productId) throws ProductException {
        return reviewRepo.findAllByProductId(productId);
    }


}
