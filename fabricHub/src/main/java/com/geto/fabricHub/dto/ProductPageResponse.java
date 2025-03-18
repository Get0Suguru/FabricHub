package com.geto.fabricHub.dto;

import com.geto.fabricHub.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductPageResponse {

    private List<Product> content;
    private int pageNo;
    private int pageSize;

    private long totalElements;
    private int totalPages;

    private boolean lastPage;
}
