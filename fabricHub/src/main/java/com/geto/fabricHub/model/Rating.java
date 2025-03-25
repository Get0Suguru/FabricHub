package com.geto.fabricHub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

    private Integer rating;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name="prod_id")
    @JsonIgnore
    private Product product;

    @JsonIgnore
    private LocalDateTime createdAT;


}
