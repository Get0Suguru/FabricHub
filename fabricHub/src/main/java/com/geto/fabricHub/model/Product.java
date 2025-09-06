package com.geto.fabricHub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
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

@Table(
        indexes = {
                @Index(name = "idx_product_title", columnList = "title"),
                @Index(name= "idx_product_brand", columnList = "brand"),
                @Index(name= "idx_product_color", columnList = "color"),

        }
)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @JsonProperty(access = JsonProperty.Access.READ_ONLY)                   //making it read only || usefull for get only fk
    private Long id;

    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    @JsonIgnore
    private String description;

    private Integer price;
    private Integer discountedPrice;
    private Integer discountPresent;

    private Integer quantity;

    private String brand;
    private String color;

//    @ElementCollection
//    @CollectionTable(name="size", joinColumns = @JoinColumn(name="product_id"))
    @JsonIgnore
    @OneToMany(mappedBy="product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Size> size = new ArrayList<>();

//    size

    @Lob
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Rating> rating = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Review> review = new ArrayList<>();

    @ManyToOne()
    @JoinColumn(name="category_id")
    private Category category;


    private LocalDateTime createdAt;


}
