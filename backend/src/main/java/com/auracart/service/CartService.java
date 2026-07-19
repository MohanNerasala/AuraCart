package com.auracart.service;

import com.auracart.dto.CartItemRequest;
import com.auracart.dto.CartResponse;
import com.auracart.entity.*;
import com.auracart.exception.BadRequestException;
import com.auracart.exception.ResourceNotFoundException;
import com.auracart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(UUID userId) {
        Cart cart = getOrCreateCart(userId);
        return buildCartResponse(cart);
    }

    @Transactional
    public CartResponse addItem(UUID userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        ProductVariant variant = null;
        if (request.getVariantId() != null) {
            variant = productVariantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variant", "id", request.getVariantId()));
        }

        // Check if item already exists in cart
        CartItem existingItem;
        if (request.getVariantId() != null) {
            existingItem = cartItemRepository
                    .findByCartIdAndProductIdAndVariantId(cart.getId(), request.getProductId(), request.getVariantId())
                    .orElse(null);
        } else {
            existingItem = cartItemRepository
                    .findByCartIdAndProductId(cart.getId(), request.getProductId())
                    .orElse(null);
        }

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(cartItem);
            
            // Critical: update the in-memory collection so the L1 cache reflects the new item
            if (cart.getItems() != null) {
                cart.getItems().add(cartItem);
            }
        }

        return getCart(userId);
    }

    @Transactional
    public CartResponse updateItemQuantity(UUID userId, UUID itemId, int quantity) {
        if (quantity < 1) {
            throw new BadRequestException("Quantity must be at least 1");
        }

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return getCart(userId);
    }

    @Transactional
    public CartResponse removeItem(UUID userId, UUID itemId) {
        cartItemRepository.deleteById(itemId);
        return getCart(userId);
    }

    @Transactional
    public void clearCart(UUID userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null) {
            cartItemRepository.deleteByCartId(cart.getId());
        }
    }

    private Cart getOrCreateCart(UUID userId) {
        return cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    Cart newCart = Cart.builder()
                            .user(user)
                            .items(new ArrayList<>())
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    private CartResponse buildCartResponse(Cart cart) {
        var items = cart.getItems() != null ? cart.getItems().stream()
                .map(item -> {
                    BigDecimal price = item.getProduct().getDiscountPrice() != null
                            ? item.getProduct().getDiscountPrice()
                            : item.getProduct().getPrice();

                    BigDecimal variantModifier = BigDecimal.ZERO;
                    if (item.getVariant() != null) {
                        variantModifier = item.getVariant().getPriceModifier();
                    }

                    BigDecimal finalPrice = price.add(variantModifier);
                    BigDecimal subtotal = finalPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

                    return CartResponse.CartItemResponse.builder()
                            .id(item.getId())
                            .productId(item.getProduct().getId())
                            .productName(item.getProduct().getName())
                            .productSlug(item.getProduct().getSlug())
                            .productImage(item.getProduct().getImageUrl())
                            .productPrice(item.getProduct().getPrice())
                            .productDiscountPrice(item.getProduct().getDiscountPrice())
                            .variantId(item.getVariant() != null ? item.getVariant().getId() : null)
                            .variantType(item.getVariant() != null ? item.getVariant().getVariantType() : null)
                            .variantValue(item.getVariant() != null ? item.getVariant().getVariantValue() : null)
                            .variantPriceModifier(variantModifier)
                            .quantity(item.getQuantity())
                            .subtotal(subtotal)
                            .build();
                })
                .collect(Collectors.toList()) : new ArrayList<CartResponse.CartItemResponse>();

        BigDecimal totalAmount = items.stream()
                .map(CartResponse.CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream()
                .mapToInt(CartResponse.CartItemResponse::getQuantity)
                .sum();

        return CartResponse.builder()
                .id(cart.getId())
                .items(items)
                .totalAmount(totalAmount)
                .totalItems(totalItems)
                .build();
    }
}
