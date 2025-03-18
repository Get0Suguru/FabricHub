package com.geto.fabricHub.dto;

import com.geto.fabricHub.model.Rating;
import com.geto.fabricHub.model.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {

    private String title;

    private String description;

    private Integer price;
    private Integer discountedPrice;
    private Integer discountPresent;

    private Integer quantity;

    private String brand;
    private String color;

    private List<Size> size;

    private String imageUrl;

    private List<Rating> ratings;

    private List<ReviewResponse> reviews;

    private String topLevelCategory;
    private String secondLevelCategory;
    private String thirdLevelCategory;


}
