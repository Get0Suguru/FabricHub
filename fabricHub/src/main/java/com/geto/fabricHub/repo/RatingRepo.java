package com.geto.fabricHub.repo;

import com.geto.fabricHub.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepo extends JpaRepository<Rating, Long> {

    public List<Rating> findAllByProductId(long productId);

    public Rating findByProductIdAndUserId(long productId, long userId);

    Rating rating(Integer rating);
}
