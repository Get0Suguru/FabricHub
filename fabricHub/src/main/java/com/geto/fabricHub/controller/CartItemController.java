package com.geto.fabricHub.controller;

import com.geto.fabricHub.dto.ApiResponse;
import com.geto.fabricHub.exception.CartItemException;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.service.CartItemService;
import com.geto.fabricHub.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart/item")
public class CartItemController {


    private UserService userService;
    private CartItemService cartItemService;

    public CartItemController(UserService userService, CartItemService cartItemService) {
        this.userService = userService;
        this.cartItemService = cartItemService;
    }

    //remove cart item
    @DeleteMapping("/{cartItemId}")

    public ResponseEntity<ApiResponse> deleteCartItem(@CookieValue("jwtToken") String jwtToken,
                                                      @PathVariable("cartItemId") Long cartItemId) throws UserException, CartItemException {
        User user = userService.findUserProfileByJwt(jwtToken);
        cartItemService.removeCartItem(user.getId(), cartItemId);

        return new ResponseEntity<>(new ApiResponse("item deleted successfully", true), HttpStatus.OK);

    }
//
//    @PutMapping("/{cartItemId}")
//    public ResponseEntity<CartItem> updateCartItem(@RequestBody CartItem cartItem,
//                                                   @RequestHeader("Authorization") String authHeader,
//                                                   @PathVariable("cartItemId") Long cartItemId) throws UserException, CartItemException {
//        User user = userService.findUserProfileByJwt(authHeader);
//
//        CartItem updatedCartItem = cartItemService.updateCartItem(user.getId(), cartItemId, cartItem);
//
//        return new ResponseEntity<>(cartItem, HttpStatus.ACCEPTED);
//    }

}
