package com.geto.fabricHub.controller;

import com.geto.fabricHub.dto.ApiResponse;
import com.geto.fabricHub.exception.OrderException;
import com.geto.fabricHub.model.Order;
import com.geto.fabricHub.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminOrderController {

    private OrderService orderService;

    private AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrder();

        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
    }

    // these methods are for seller to update orderStatus
    @PutMapping("/{orderId}/confirmed")
    public ResponseEntity<Order> confirmedOrderHandler(
            @PathVariable("orderId") Long orderId) throws OrderException {
        Order order = orderService.confirmedOrder(orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @PutMapping("/{orderId}/ship")
    public ResponseEntity<Order> shippedOrderHandler(@PathVariable("orderId") Long orderId ) throws OrderException{
        Order order = orderService.shippedOrder(orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable("orderId") Long orderId) throws OrderException{
        Order order = orderService.canceledOrder(orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @DeleteMapping("/{orderId}/delete")
    public ResponseEntity<ApiResponse> deleteOrderHandler(@PathVariable("orderId") Long orderId) throws OrderException{
        orderService.deleteOrder(orderId);
        return new ResponseEntity<>(new ApiResponse("order deleted successfully", true),HttpStatus.OK );
    }
}
