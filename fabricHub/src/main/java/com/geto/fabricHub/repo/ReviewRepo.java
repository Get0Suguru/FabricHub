package com.geto.fabricHub.repo;

import com.geto.fabricHub.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Long> {

    public List<Review> findAllByProductId(long productId);
}
