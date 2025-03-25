package com.geto.fabricHub.controller;

import com.geto.fabricHub.dto.ApiResponse;
import com.geto.fabricHub.exception.CartItemException;
import com.geto.fabricHub.exception.OrderException;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.Address;
import com.geto.fabricHub.model.Order;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.service.OrderService;
import com.geto.fabricHub.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private UserService userService;
    private OrderService orderService;

    public OrderController(UserService userService, OrderService orderService) {
        this.userService = userService;
        this.orderService = orderService;
    }

    //creating order
    @PostMapping("/create/new/{addressId}")             // we already saved address in db so just gonna use id now
    public ResponseEntity<ApiResponse> createOrder(@PathVariable("addressId") Long addressId,
                                                   @CookieValue("jwtToken") String jwtToken) throws UserException, OrderException, CartItemException {

        User user = userService.findUserProfileByJwt(jwtToken);
        String resultMsg = orderService.createOrder(user, addressId);

        return new ResponseEntity<>(new ApiResponse(resultMsg, true), HttpStatus.CREATED);
    }


    @GetMapping("/user")
    public ResponseEntity<List<Order>> userOrderHistory(@CookieValue("jwtToken") String jwtToken) throws UserException{

        User user = userService.findUserProfileByJwt(jwtToken);
        List<Order> orders = orderService.getUserAllOrders(user);
        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Order> findOrderById(@PathVariable("id") Long orderId,
                                             @CookieValue("jwtToken") String jwtToken)
            throws UserException, OrderException{

        User user = userService.findUserProfileByJwt(jwtToken);

        Order order = orderService.findOrderById(orderId);

        if(!order.getUser().equals(user)) {
            throw new UserException("Unexpected user is trying to make changes to the order");

        }
        return new ResponseEntity<>(order, HttpStatus.ACCEPTED);
    }
 }
