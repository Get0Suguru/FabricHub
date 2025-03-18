package com.geto.fabricHub.repo;

import com.geto.fabricHub.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepo extends JpaRepository<Category, Integer> {

    Category findByName(String categoryName);

    Category findByNameAndParentCategory(String categoryName, Category parentCategory);
}
