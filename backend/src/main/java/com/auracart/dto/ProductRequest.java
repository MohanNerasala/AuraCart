package com.auracart.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    private String slug;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", message = "Price must be positive")
    private BigDecimal price;

    @DecimalMin(value = "0.0", message = "Discount price must be positive")
    private BigDecimal discountPrice;

    @NotNull(message = "Category ID is required")
    private UUID categoryId;

    @Min(value = 0, message = "Stock must be non-negative")
    private Integer stock = 0;

    private Boolean featured = false;

    private String imageUrl;

    private List<ImageRequest> images;
    private List<VariantRequest> variants;

    @Data
    public static class ImageRequest {
        @NotBlank(message = "Image URL is required")
        private String imageUrl;
        private String altText;
        private Integer sortOrder = 0;
    }

    @Data
    public static class VariantRequest {
        @NotBlank(message = "Variant type is required")
        private String variantType;

        @NotBlank(message = "Variant value is required")
        private String variantValue;

        private BigDecimal priceModifier = BigDecimal.ZERO;
        private Integer stock = 0;
    }
}
