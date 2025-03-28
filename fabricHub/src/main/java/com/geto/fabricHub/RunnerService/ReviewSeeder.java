//package com.geto.fabricHub.RunnerService;
//
//import com.geto.fabricHub.model.Product;
//import com.geto.fabricHub.model.Rating;
//import com.geto.fabricHub.model.Review;
//import com.geto.fabricHub.repo.ProductRepo;
//import com.geto.fabricHub.repo.RatingRepo;
//import com.geto.fabricHub.repo.ReviewRepo;
//import com.geto.fabricHub.repo.UserRepo;
//import jakarta.transaction.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//import org.springframework.web.servlet.view.freemarker.FreeMarkerView;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Random;
//
//// thinking direction - so u won't think worong
//// this seeder is made to work like setting and creating 2 review at a time like one & its nextone are workign same time
//
//@Component
//public class ReviewSeeder implements CommandLineRunner {
//
//    public String[] reviewArray = {"Absolutely love this! Fits perfectly and feels premium. Worth every penny!",
//            "Great quality and comfy. Slightly tight fit but looks sharp. Happy overall.",
//            "Amazing product! Super soft and stylish. My go-to for casual days.",
//            "Decent quality but sizing runs small. Okay for the price, I guess.",
//            "Really nice fabric and design. Could use more color options. Satisfied!",
//            "Perfect fit and so comfortable! Looks great with any outfit. Love it!",
//            "Solid product, feels durable. Took a bit to break in but now it’s great.",
//            "Wow, this is stunning! High quality and elevates my style. Recommend!",
//            "Very classy and comfortable. Wish it was a bit cheaper but good buy.",
//            "Best purchase ever! Super comfy and stylish. I’m buying another!",
//            "It’s okay, but the fit isn’t perfect. Material is good though.",
//            "Love the look and feel! Perfect for daily wear. Highly recommend!",
//            "Nice quality, fits well. Color is slightly off but still looks good.",
//            "Fantastic product! So comfy and stylish. Worth the price tag!",
//            "Great for workouts, very supportive. A bit pricey but does the job.",
//            "Obsessed with this! Perfect fit and super soft. Must-have item!",
//            "Okay product, but expected better stitching. Decent for the cost.",
//            "Really like the style and comfort. Runs a bit large but manageable.",
//            "Top-notch quality! Looks amazing and feels so good. Love it!",
//            "Good product, fits nicely. Wish it had more size options. Happy!"};
//
//    @Autowired
//    private ProductRepo prodRepo;
//
//    @Autowired
//    private ReviewRepo revRepo;
//
//    @Autowired
//    private RatingRepo ratingRepo;
//
//    @Autowired
//    private UserRepo userRepo;
//
//    Random random = new Random();
//
//
//    // Helper method to generate random created_at (past 1 year)
//    private LocalDateTime getRandomCreatedAt() {
//        LocalDateTime now = LocalDateTime.now();
//        LocalDateTime oneYearAgo = now.minusYears(1);
//        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(oneYearAgo, now);
//        long randomDays = random.nextLong(daysBetween + 1); // 0 to 365 days
//        return oneYearAgo.plusDays(randomDays)
//                .plusHours(random.nextInt(24))
//                .plusMinutes(random.nextInt(60))
//                .plusSeconds(random.nextInt(60));
//    }
//
//
//    @Override
//    @Transactional
//    public void run(String... args) throws Exception {
//
//        List<Product> productList = prodRepo.findAll();
//
//
//        for(Product prod: productList){
//
//            Review review1 = new Review();              // just think every review displaable should have a
//            Rating rating1 = new Rating();              //  respecitve user rating give (ezz thinkable )
//
//            Review review2 = new Review();
//            Rating rating2 = new Rating();
//
//            // setting up their attributes ok (don't be overwhelmend) just remove rating once if can't think ok
//            review1.setReview(reviewArray[random.nextInt(reviewArray.length)]);
//            review1.setCreatedAt(getRandomCreatedAt());
//            rating1.setRating(random.nextInt(3) + 3);               // this will give random val btw 3,4,5
//
//            review2.setReview(reviewArray[random.nextInt(reviewArray.length)]);
//            review2.setCreatedAt(getRandomCreatedAt());
//            rating2.setRating(random.nextInt(3) + 3);               // this will give random val btw 3,4,5
//
//
//            // setting up the product_id as per sql  && prod as per model/hibernate
//            review1.setProduct(prod);
//            rating1.setProduct(prod);
//
//            review2.setProduct(prod);
//            rating2.setProduct(prod);
//
//            String gender = prod.getCategory().getParentCategory().getParentCategory().getName();
//            if(gender.equals("Men")){
//                review1.setUser(userRepo.findById(3L).get());
//                rating1.setUser(userRepo.findById(3L).get());
//
//                review2.setUser(userRepo.findById(4L).get());
//                rating2.setUser(userRepo.findById(4L).get());
//            }
//            else if(gender.equals("Women")){
//                review1.setUser(userRepo.findById(1L).get());
//                rating1.setUser(userRepo.findById(1L).get());
//
//                review2.setUser(userRepo.findById(2L).get());
//                rating2.setUser(userRepo.findById(2L).get());
//            }
//
//
//            revRepo.save(review1);
//            ratingRepo.save(rating1);
//
//            revRepo.save(review2);
//            ratingRepo.save(rating2);
//
//                        System.out.println("Random reviews (with rating also) seeded for product with id : " + prod.getId());
//
//        }
//
//    }
//
//
//}
