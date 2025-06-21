package com.geto.fabricHub.service;

import com.geto.fabricHub.exception.CartItemException;
import com.geto.fabricHub.exception.UserException;
import com.geto.fabricHub.model.Order;
import com.geto.fabricHub.model.User;
import com.geto.fabricHub.model.Address;
import com.geto.fabricHub.exception.OrderException;

import java.util.List;

public interface OrderService {

    public String createOrder(User user, Long addressId) throws OrderException, CartItemException, UserException;

    public Order findOrderById(long orderId) throws OrderException;

//    public List<Order> userOrderHistory(long userId);

    public Order placedOrder(long orderId) throws OrderException;

    public Order confirmedOrder(long orderId) throws OrderException;

    public Order shippedOrder(long orderId) throws OrderException;

    public Order deliveredOrder(long orderId) throws OrderException;

    public Order canceledOrder(long orderId) throws OrderException;

    public List<Order> getUserAllOrders(User user);

    public List<Order> getAllOrder();

    public void deleteOrder(long orderId) throws OrderException;
}

