package com.auracart.service;

import com.auracart.dto.ProductResponse;
import com.auracart.entity.Product;
import com.auracart.entity.User;
import com.auracart.entity.Wishlist;
import com.auracart.exception.BadRequestException;
import com.auracart.exception.ResourceNotFoundException;
import com.auracart.repository.ProductRepository;
import com.auracart.repository.UserRepository;
import com.auracart.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<ProductResponse> getWishlist(UUID userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(w -> ProductResponse.fromEntityBasic(w.getProduct()))
                .collect(Collectors.toList());
    }

    public boolean isInWishlist(UUID userId, UUID productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }

    @Transactional
    public void addToWishlist(UUID userId, UUID productId) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new BadRequestException("Product is already in wishlist");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .build();
        wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeFromWishlist(UUID userId, UUID productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }
}
