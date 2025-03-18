package com.geto.fabricHub.dto;

import com.geto.fabricHub.model.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {

private String title;
private String description;

private int price;
private int discountedPrice;
private int discountPresent;

private int quantity;

private String brand;
private String color;

private List<Size> size = new ArrayList<>();

private String imageUrl;

private String topLevelCategory;
private String secondLevelCategory;
private String thirdLevelCategory;

}
