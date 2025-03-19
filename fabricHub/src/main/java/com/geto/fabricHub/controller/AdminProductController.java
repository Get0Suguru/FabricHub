package com.geto.fabricHub.controller;

import com.geto.fabricHub.dto.ApiResponse;
import com.geto.fabricHub.dto.ProductPageResponse;
import com.geto.fabricHub.dto.ProductDTO;
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
@RequestMapping("/api/admin/products")
public class AdminProductController {

    @Autowired
    private ProductService productService;


    @GetMapping("/test")
    public ResponseEntity<String> controllerTest(){
        return new ResponseEntity<String>("life is shit but adminProductController controller works like charm", HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<Product> createProduct(@RequestBody ProductDTO req) throws ProductException {
        Product product = productService.createProduct(req);
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @DeleteMapping("/{produdctId}/delete")
    public ResponseEntity<ApiResponse> deteteProduct(@PathVariable("productId") Long prodId) throws ProductException {
        productService.deleteProduct(prodId);
        return new ResponseEntity<>(new ApiResponse("product deleted Successfully", true), HttpStatus.OK);
    }
    @GetMapping("/all/list")
    public ResponseEntity<List<Product>> findAllProducts() throws ProductException{
        List<Product> products = productService.findAllProducts();
        return new ResponseEntity<>(products, HttpStatus.ACCEPTED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Product>> findAllProductsAsPage(
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(required = false) String color,

            @RequestParam(required = false) String sort,

            @RequestParam(defaultValue = "0" ) int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) throws ProductException{

        Pageable pageable = PageRequest.of(pageNo, pageSize);

        ProductPageResponse products = productService.getAllFilteredProducts(gender, category, minPrice, maxPrice,
                minDiscount, color, sort, pageable);

        return new ResponseEntity<>(products.getContent(), HttpStatus.ACCEPTED );

    }

    @PutMapping("/{productId}/update")
    public ResponseEntity<ApiResponse> updateProductQuantity(@RequestParam("quantity") Integer quantity,
                                                             @PathVariable("productId") Long prodId) throws ProductException{
        String message = productService.updateProductStock(prodId, quantity);
        return new ResponseEntity<>(new ApiResponse(message, true), HttpStatus.OK);
    }

    @PostMapping("/create/max")
    public ResponseEntity<ApiResponse> createMulitpleProducts(@RequestBody ProductDTO[] req) throws ProductException {

        //each entity is product so use a loop and the method above to create a new one
        for(ProductDTO product: req){
            productService.createProduct(product);
        }
        return new ResponseEntity<>(new ApiResponse("products added successfully", true), HttpStatus.CREATED);
    }


}
