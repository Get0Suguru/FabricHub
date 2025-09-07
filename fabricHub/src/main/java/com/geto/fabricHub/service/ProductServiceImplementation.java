package com.geto.fabricHub.service;

import com.geto.fabricHub.dto.ProductPageResponse;
import com.geto.fabricHub.dto.ProductDTO;
import com.geto.fabricHub.dto.ProductResponse;
import com.geto.fabricHub.dto.ReviewResponse;
import com.geto.fabricHub.exception.ProductException;
import com.geto.fabricHub.model.Category;
import com.geto.fabricHub.model.Product;
import com.geto.fabricHub.model.Review;
import com.geto.fabricHub.model.Size;
import com.geto.fabricHub.repo.CategoryRepo;
import com.geto.fabricHub.repo.ProductRepo;
import com.geto.fabricHub.repo.RatingRepo;
import com.geto.fabricHub.repo.ReviewRepo;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImplementation implements ProductService {

    private final ProductRepo productRepo;
    private final CategoryRepo categoryRepo;
    private final ReviewRepo reviewRepo;
    private final RatingRepo ratingRepo;

    public ProductServiceImplementation(ProductRepo productRepo, CategoryRepo categoryRepo, ReviewRepo reviewRepo, RatingRepo ratingRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.reviewRepo = reviewRepo;
        this.ratingRepo = ratingRepo;
    }

    @Override
    public List<Product> findAllProducts() throws ProductException {
        return productRepo.findAll();
    }

    @Override
    public Product createProduct(ProductDTO productDto) throws ProductException {

//  ---------------- THIS part will generate the category if they aren't in the category table of db -------------------

        Category topLevel = categoryRepo.findByName(productDto.getTopLevelCategory());
        if(topLevel == null) {
            topLevel = Category.builder()
                    .name(productDto.getTopLevelCategory())
                    .level(1)
                    .build();
            categoryRepo.save(topLevel);
        }

        Category secondLevel = categoryRepo.findByNameAndParentCategory(productDto.getSecondLevelCategory(), topLevel);
        if(secondLevel == null){
            secondLevel = Category.builder()
                    .name(productDto.getSecondLevelCategory())
                    .level(2)
                    .parentCategory(topLevel)
                    .build();
            categoryRepo.save(secondLevel);
        }

        Category thirdLevel = categoryRepo.findByNameAndParentCategory(productDto.getThirdLevelCategory(), secondLevel);
        if(thirdLevel == null){
            thirdLevel = Category.builder()
                    .name(productDto.getThirdLevelCategory())
                    .level(3)
                    .parentCategory(secondLevel)
                    .build();
            categoryRepo.save(thirdLevel);
        }
//      ----------------------------------------------------------------------------------------------------------------

    Product product = new Product();
            product.setTitle(productDto.getTitle());
            product.setDescription(productDto.getDescription());
            product.setPrice(productDto.getPrice());
            product.setDiscountedPrice(productDto.getDiscountedPrice());
            product.setDiscountPresent(productDto.getDiscountPresent());
            product.setQuantity(productDto.getQuantity());
            product.setBrand(productDto.getBrand());
            product.setColor(productDto.getColor());
            product.setSize(productDto.getSize());
            product.setImageUrl(productDto.getImageUrl());
            product.setCategory(thirdLevel);

        return productRepo.save(product);

    }

    @Override
    public String deleteProduct(Long productId) throws ProductException{
        productRepo.deleteById(productId);
        return "product deleted successfully";
    }

    @Override
    public String updateProductStock(Long productId, int quantity) throws ProductException{
        Optional<Product> product = productRepo.findById(productId);

        if(product.isPresent()){
            Product existingProduct = product.get();
            existingProduct.setQuantity(quantity);

            return "Product having id " + existingProduct.getId()+ "had new stock: " + quantity ;
        }
    throw new ProductException("product of id: " + productId + "doesn't exist");
    }

    @Cacheable(value = "product", key = "#productId", unless = "#result == null")
    @Override
    public Product findProductById(Long productId) throws ProductException{
        Optional<Product> optionalProduct = productRepo.findById(productId);
        if(optionalProduct.isPresent()){
            return optionalProduct.get();
        }
        throw new ProductException("product not found with id: "+ productId);
    }

    @Override
    public List<Product> searchProduct(String queryString) throws ProductException {

        Pageable pageable = PageRequest.of(0,5);
        return productRepo.searchProduct(queryString, pageable);
    }

    @Cacheable(value = "productDetails", key = "#productId", unless = "#result == null")
    @Override
    public ProductResponse findProductDetialsById(Long productId) throws ProductException{
        Optional<Product> optionalProduct = productRepo.findById(productId);


        if(optionalProduct.isPresent()){
            Product prod = optionalProduct.get();

           ProductResponse prodRes = new ProductResponse();
           prodRes.setTitle(prod.getTitle());
           prodRes.setDescription(prod.getDescription());
           prodRes.setPrice(prod.getPrice());
           prodRes.setDiscountedPrice(prod.getDiscountedPrice());
           prodRes.setDiscountPresent(prod.getDiscountPresent());
           prodRes.setQuantity(prod.getQuantity());
           prodRes.setBrand(prod.getBrand());
           prodRes.setColor(prod.getColor());

            prodRes.setSize(prod.getSize());

           prodRes.setImageUrl(prod.getImageUrl());

           prodRes.setRatings(prod.getRating());

           //setting reviewResponse as per sent with product (it have username, created at, and rating also)

                List<Review> reviews = reviewRepo.findAllByProductId(productId);
                List<ReviewResponse> reviewResponseList = new ArrayList<>();

                for(Review review: reviews){
                    ReviewResponse reviewResponse = new ReviewResponse();
                    reviewResponse.setReview(review.getReview());
                    reviewResponse.setUserName(review.getUser().getFirstName());
                    reviewResponse.setCreatedAt(review.getCreatedAt());

                    Integer ratingValue = ratingRepo.findByProductIdAndUserId(productId, review.getUser().getId()).getRating();
                    reviewResponse.setRating(ratingValue);
                    reviewResponseList.add(reviewResponse);
                }
           prodRes.setReviews(reviewResponseList);
           // -------------------------------------------------------------------------------------------------------------

           prodRes.setTopLevelCategory(prod.getCategory().getParentCategory().getParentCategory().getName());
           prodRes.setSecondLevelCategory(prod.getCategory().getParentCategory().getName());
           prodRes.setThirdLevelCategory(prod.getCategory().getName());

           return prodRes;

        }
        throw new ProductException("product not found with id: "+ productId);
    }

    @Override
    public ProductPageResponse getAllFilteredProducts(String gender,
                                                      String category,
                                                      Integer minPrice,
                                                      Integer maxPrice,
                                                      Integer minDiscount,
                                                      String sort,
                                                      String color,
                                                      Pageable pageable) {

        Page<Product> page = productRepo.filterProducts(gender, category, minPrice, maxPrice, minDiscount, sort, color, pageable);
        ProductPageResponse responsePage = new ProductPageResponse();
               responsePage.setContent(page.getContent());
                responsePage.setPageNo(page.getNumber());
                responsePage.setPageSize(page.getSize());
                responsePage.setTotalElements(page.getTotalElements());
                responsePage.setTotalPages(page.getTotalPages());
                responsePage.setLastPage(page.isLast());

                return responsePage;

    }





}
