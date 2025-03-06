package com.geto.fabricHub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.action.internal.OrphanRemovalAction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    private String role;
    private Long mobile;

    @OneToMany(mappedBy = "user")
    private List<Address> Address = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name="payment_info", joinColumns = @JoinColumn(name="user_id") )
    private List<PaymentInfo> PaymentInfo = new ArrayList<>();


    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Rating> Rating = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Review> Review = new ArrayList<>();

    @OneToMany(mappedBy= "user", cascade = CascadeType.ALL)
    private List<Order> Orders = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Cart cart;

//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<CartItem> cartItems;

    private LocalDateTime createdAt;



}
