package com.geto.fabricHub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

@Table(name= "orders")
public class Order{
//    rem one thing order repress a cart like (bunch or orders )
//    and orderItem represent an individual stuff in order

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double totalPrice;
    private Integer totalDicountedPrice;
    private Integer discount;
    private String orderStatus;
    private int totalItems;
    private LocalDateTime createdAt;
    private LocalDateTime orderDate;
    private LocalDateTime deliveryDate;

    @ManyToOne              // i made it uni-directional only
    @JoinColumn(name = "shipping_address_id")
    private Address shippingAddress;

    @Embedded
    private PaymentDetails paymentDetails = new PaymentDetails();

    @ManyToOne
    @JoinColumn(name= "user_id")
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy="order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();



}