package com.geto.fabricHub.repo;

import com.geto.fabricHub.model.Order;
import com.geto.fabricHub.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepo extends JpaRepository<Order, Long> {

    // get all the orders that are in before delivery stage

//    @Query("select o from Order o where o.user.id= :userId And (o.orderStatus = 'PLACED' or o.orderStatus='CONFIRMED' or o.orderStatus = 'SHIPPED' or o.orderStatus = 'DELIVERED' ) ")
//    public List<Order> getUsersOrder(@Param("userId") Long userId);

    @Transactional
    @Modifying
    public void deleteById(Long id);

    public List<Order> findByUser(User user);

}
