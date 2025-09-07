package com.geto.fabricHub.repo;

import com.geto.fabricHub.model.Product;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {

    // filter product methods
    @Cacheable(value = "products",
            key = "{#gender, #category, #minPrice, #maxPrice, #minDiscount, #color, #sort, #pageable.pageNumber, #pageable.pageSize}",
            unless = "#result == null or #result.isEmpty()")
    @Query("select p from Product p " +
            "JOIN FETCH p.category c "+      // eager fetch to avoid N+1
            "LEFT Join c.parentCategory pc "+
            "LEFT Join pc.parentCategory ppc "+
            "WHERE (c.name=:category or pc.name=:category or ppc.name=:category or :category is null)" +
            "and (:gender is null or :gender=p.category.parentCategory.parentCategory.name) "+
            "and (:minPrice is null or p.price>=:minPrice) " +
            "and (:maxPrice is null or p.price<=:maxPrice) " +
            "and (:minDiscount is null or p.discountedPrice >= :minDiscount) " +
            "and (:color is null or p.color = :color) " +
            "order by " +
            "case when :sort='price_low' then p.discountedPrice end asc, " +
            "case when :sort='price_high' then p.discountedPrice end desc")
    public Page<Product> filterProducts(
            @Param("gender") String gender,
            @Param("category") String category,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("minDiscount") Integer minDiscount,
            @Param("sort") String sort,
            @Param("color") String color,
            Pageable pageable
    );


    // serach product method
//    @Query("SELECT p from Product p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%',:queryString,'%')) OR " +
//            "LOWER(p.description) LIKE LOWER(CONCAT('%',:queryString,'%')) OR " +
//            "LOWER(p.brand) LIKE LOWER(CONCAT('%',:queryString,'%')) OR " +
//            "(p.category IS NOT NULL AND LOWER(p.category.name) LIKE LOWER(CONCAT('%',:queryString,'%')))")

    @Query("select p from Product p where lower(p.title) like lower(concat('%', :queryString, '%') )  or " +
            "lower(p.brand) like lower(concat('%', :queryString, '%') ) or " +
            "lower(p.color) like lower(concat('%', :queryString, '%') ) or " +
            "(p.category is not null and lower(p.category.name) like lower(concat('%', :queryString, '%')))" )
    public List<Product> searchProduct(@Param("queryString") String queryString, Pageable pageable);


}
