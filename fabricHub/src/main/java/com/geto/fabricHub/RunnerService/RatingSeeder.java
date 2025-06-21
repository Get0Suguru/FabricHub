//package com.geto.fabricHub.RunnerService;
//import com.geto.fabricHub.model.Product;
//import com.geto.fabricHub.model.Rating;
//import com.geto.fabricHub.repo.ProductRepo;
//import com.geto.fabricHub.repo.RatingRepo;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//import org.springframework.beans.factory.annotation.Autowired;
//import java.util.Random;
//import java.util.List;
//
//@Component
//public class RatingSeeder implements CommandLineRunner {
//
//    @Autowired
//    private ProductRepo productRepository;
//
//    @Autowired
//    private RatingRepo ratingRepository;
//
//
//    Random random = new Random();
//
//    public int giveMeRatingNo(){
//        return random.nextInt(10) + 15;               // give me value between 15 and 25
//    }
//
//    public int giveMeRandomRating(){
//        return random.nextInt(5) + 1;           // give me value btw 1 to 5
//    }
//
//    public void run(String... args) throws Exception {
//
//
//        // TODO: Replace with your actual product IDs
//        List<Product> prods = productRepository.findAll();
//
//        for (Product prod : prods) {
//
//            for (int i = 0; i < giveMeRatingNo(); i++) {
//                Rating rating = new Rating();
//
//                rating.setProduct(prod);                                    // Set the product entity (not prod_id directly)
//                rating.setRating(giveMeRandomRating());                     // Random value 1-5 (inclusive)
//
//                ratingRepository.save(rating);
//            }
//            System.out.println("Random ratings seeded for product with id : " + prod.getId());
//
//        }
//
//    }
//}
