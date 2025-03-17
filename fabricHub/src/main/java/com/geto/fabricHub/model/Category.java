package com.geto.fabricHub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Size(max=50)
    private String name;

    private int level;

    @JsonIgnore
    @OneToMany(mappedBy = "category")
    private List<Product> product;

    @ManyToOne
    @JoinColumn(name = "parentCategory_id")
    @JsonIgnore
    private Category parentCategory;
}
