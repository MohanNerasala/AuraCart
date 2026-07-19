package com.auracart.dto;

import com.auracart.entity.Product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private UUID id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private UUID categoryId;
    private String categoryName;
    private String categorySlug;
    private Integer stock;
    private BigDecimal rating;
    private Integer reviewCount;
    private Boolean featured;
    private String imageUrl;
    private List<ImageDto> images;
    private List<VariantDto> variants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageDto {
        private UUID id;
        private String imageUrl;
        private String altText;
        private Integer sortOrder;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VariantDto {
        private UUID id;
        private String variantType;
        private String variantValue;
        private BigDecimal priceModifier;
        private Integer stock;
    }

    public static ProductResponse fromEntity(Product product) {
        ProductResponse response = ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .discountPrice(product.getDiscountPrice())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .categorySlug(product.getCategory().getSlug())
                .stock(product.getStock())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .featured(product.getFeatured())
                .imageUrl(product.getImageUrl())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();

        if (product.getImages() != null) {
            response.setImages(product.getImages().stream()
                    .map(img -> ImageDto.builder()
                            .id(img.getId())
                            .imageUrl(img.getImageUrl())
                            .altText(img.getAltText())
                            .sortOrder(img.getSortOrder())
                            .build())
                    .collect(Collectors.toList()));
        } else {
            response.setImages(Collections.emptyList());
        }

        if (product.getVariants() != null) {
            response.setVariants(product.getVariants().stream()
                    .map(v -> VariantDto.builder()
                            .id(v.getId())
                            .variantType(v.getVariantType())
                            .variantValue(v.getVariantValue())
                            .priceModifier(v.getPriceModifier())
                            .stock(v.getStock())
                            .build())
                    .collect(Collectors.toList()));
        } else {
            response.setVariants(Collections.emptyList());
        }

        return response;
    }

    public static ProductResponse fromEntityBasic(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .discountPrice(product.getDiscountPrice())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .categorySlug(product.getCategory().getSlug())
                .stock(product.getStock())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .featured(product.getFeatured())
                .imageUrl(product.getImageUrl())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .images(Collections.emptyList())
                .variants(Collections.emptyList())
                .build();
    }
}
