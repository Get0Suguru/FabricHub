package com.geto.fabricHub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddItemRequest {

    private Long productId;
    private String size;
    private Integer quantity;
    private Integer price;

}
