package com.auracart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private UUID id;
    private List<CartItemResponse> items;
    private BigDecimal totalAmount;
    private Integer totalItems;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private UUID id;
        private UUID productId;
        private String productName;
        private String productSlug;
        private String productImage;
        private BigDecimal productPrice;
        private BigDecimal productDiscountPrice;
        private UUID variantId;
        private String variantType;
        private String variantValue;
        private BigDecimal variantPriceModifier;
        private Integer quantity;
        private BigDecimal subtotal;
    }
}
