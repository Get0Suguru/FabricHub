package com.geto.fabricHub.controller;

import com.geto.fabricHub.dto.ProductPageResponse;

import com.geto.fabricHub.dto.ProductResponse;
import com.geto.fabricHub.exception.ProductException;
import com.geto.fabricHub.model.Product;
import com.geto.fabricHub.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/test")
        public String testMethod(){
        return "working product controller";
    }


    // get all products as page output
    @GetMapping("/products")
    public ResponseEntity<ProductPageResponse> getFilteredProducts(
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(required = false) String color,

            @RequestParam(required = false) String sort,

            @RequestParam(defaultValue = "0" ) int pageNo,
            @RequestParam(defaultValue = "12") int pageSize

    ) throws ProductException {
        System.out.println("values are " + gender + " " + category + " " + minPrice + " " + maxPrice + " " +
                 minDiscount + " " + color + " " + sort + " " + pageNo + " " + pageSize);

        Pageable pageable = PageRequest.of(pageNo, pageSize);
        ProductPageResponse result = productService.getAllFilteredProducts(gender,
                category, minPrice, maxPrice,
                minDiscount, sort, color, pageable);

        System.out.println(result.getContent().size());
//        System.out.println(result.getContent());       lodu ke beej ye print nahi hote by default (ya to unhe toString method de)

        return new ResponseEntity<>(result, HttpStatus.OK);

    }

//    find by id

    @GetMapping("/products/id/{productId}")
    public ResponseEntity<ProductResponse> findProductByIdHandler(@PathVariable("productId") Long prodId) throws ProductException {

        ProductResponse product = productService.findProductDetialsById(prodId);
        return new ResponseEntity<>(product, HttpStatus.ACCEPTED);
    }


//    todo do make the serach

    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProduct(@RequestParam("queryString") String query) throws ProductException {

        List<Product> products = productService.searchProduct(query);
        return new ResponseEntity<>(products, HttpStatus.ACCEPTED);

    }


}
