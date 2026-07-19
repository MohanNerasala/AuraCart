package com.auracart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CartItemRequest {
    @NotNull(message = "Product ID is required")
    private UUID productId;

    private UUID variantId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;
}
