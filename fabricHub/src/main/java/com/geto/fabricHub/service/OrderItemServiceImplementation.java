package com.geto.fabricHub.service;

import com.geto.fabricHub.model.OrderItem;
import com.geto.fabricHub.repo.OrderItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderItemServiceImplementation implements OrderItemService{

    @Autowired
    private OrderItemRepo orderItemRepo;

    @Override
    public OrderItem createOrderitem(OrderItem orderItem) {
        return orderItemRepo.save(orderItem);
    }
}
