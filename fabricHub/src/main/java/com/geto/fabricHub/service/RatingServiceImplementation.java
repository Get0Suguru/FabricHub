package com.geto.fabricHub.service;

import com.geto.fabricHub.dto.RatingReq;
import com.geto.fabricHub.exception.ProductException;
import com.geto.fabricHub.model.Product;
import com.geto.fabricHub.model.Rating;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.repo.RatingRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RatingServiceImplementation implements RatingService{

    private RatingRepo ratingRepo;
    private ProductService productService;

    public RatingServiceImplementation(RatingRepo ratingRepo, ProductService productService) {
        this.ratingRepo = ratingRepo;
        this.productService = productService;
    }

    @Override
    public Rating createRating(RatingReq req, User user) throws ProductException {
        Product product = productService.findProductById(req.getProductId());

        Rating rating = new Rating();
        rating.setRating(req.getRating());
        rating.setUser(user);
        rating.setProduct(product);
        rating.setCreatedAT(LocalDateTime.now());

        return ratingRepo.save(rating);
    }

    @Override               // to get all ratings of a product
    public List<Rating> getAllRatings(Long productId) {
       return ratingRepo.findAllByProductId(productId);
    }
}
