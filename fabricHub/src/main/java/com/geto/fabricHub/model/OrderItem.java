package com.geto.fabricHub.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String size;
    private Integer quantity;
    private Integer price;
    private Integer discountedPrice;
    private LocalDateTime deliveryDate;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "order_id")
    private Order order;

    // only need it to be unidirectional so its just here (no mapped by in product table)
    @ManyToOne
    @JoinColumn(name="product_id")
    private Product product;

}
