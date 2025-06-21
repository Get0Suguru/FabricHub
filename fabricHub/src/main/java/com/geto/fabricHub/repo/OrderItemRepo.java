package com.geto.fabricHub.repo;

import com.geto.fabricHub.model.Order;
import com.geto.fabricHub.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long> {
    OrderItem order(Order order);
}
