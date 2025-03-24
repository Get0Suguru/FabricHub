package com.geto.fabricHub.controller;

import com.geto.fabricHub.dto.AddItemRequest;
import com.geto.fabricHub.dto.ApiResponse;
import com.geto.fabricHub.exception.CartItemException;
import com.geto.fabricHub.exception.ProductException;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.Cart;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.repo.CartRepo;
import com.geto.fabricHub.service.CartService;
import com.geto.fabricHub.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private CartService cartService;
    private UserService userService;
    private CartRepo cartRepo;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }
    

    @GetMapping("/get")
//    public ResponseEntity<Cart> findUserCart(@RequestHeader("Authorization") String authHeader) throws UserException {
    public ResponseEntity<Cart> findUserCart(@CookieValue(name="jwtToken", required=false) String jwtToken) throws UserException {

        User user = userService.findUserProfileByJwt(jwtToken);


            Cart cart = cartService.findUserCart(user.getId());
        System.out.println("cart api /get ranned");
        return new ResponseEntity<>(cart, HttpStatus.OK);

    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addItemToCart(@RequestBody AddItemRequest req,
                                                     @CookieValue(name="jwtToken", required=false) String jwtToken)
            throws UserException, ProductException, CartItemException {

//        System.out.println(jwtToken);
        User user = userService.findUserProfileByJwt(jwtToken);



        String addMessage = cartService.addCartItem(user, req);

        return new ResponseEntity<>(new ApiResponse("xxx", true), HttpStatus.OK);
    }
}
