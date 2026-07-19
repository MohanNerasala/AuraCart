package com.auracart.service;

import com.auracart.dto.CategoryRequest;
import com.auracart.dto.CategoryResponse;
import com.auracart.entity.Category;
import com.auracart.exception.ResourceNotFoundException;
import com.auracart.repository.CategoryRepository;
import com.auracart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Cacheable("categories")
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<Object[]> counts = productRepository.countProductsByCategory();
        
        Map<UUID, Long> countMap = new HashMap<>();
        for (Object[] result : counts) {
            countMap.put((UUID) result[0], (Long) result[1]);
        }
        
        return categories.stream()
                .map(category -> CategoryResponse.fromEntity(category, countMap.getOrDefault(category.getId(), 0L)))
                .collect(Collectors.toList());
    }

    @Cacheable(value = "categories", key = "#slug")
    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "slug", slug));
        Long count = productRepository.countByCategoryId(category.getId());
        return CategoryResponse.fromEntity(category, count);
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        String slug = request.getSlug() != null ? request.getSlug()
                : request.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");

        Category category = Category.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();

        category = categoryRepository.save(category);
        Long count = productRepository.countByCategoryId(category.getId());
        return CategoryResponse.fromEntity(category, count);
    }

    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        category.setName(request.getName());
        if (request.getSlug() != null) category.setSlug(request.getSlug());
        if (request.getDescription() != null) category.setDescription(request.getDescription());
        if (request.getImageUrl() != null) category.setImageUrl(request.getImageUrl());

        category = categoryRepository.save(category);
        Long count = productRepository.countByCategoryId(category.getId());
        return CategoryResponse.fromEntity(category, count);
    }

    public void deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category", "id", id);
        }
        categoryRepository.deleteById(id);
    }
}
