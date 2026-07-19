package com.auracart.service;

import com.auracart.dto.ReviewRequest;
import com.auracart.dto.ReviewResponse;
import com.auracart.dto.PageResponse;
import com.auracart.entity.Product;
import com.auracart.entity.Review;
import com.auracart.entity.User;
import com.auracart.exception.BadRequestException;
import com.auracart.exception.ResourceNotFoundException;
import com.auracart.repository.ProductRepository;
import com.auracart.repository.ReviewRepository;
import com.auracart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public PageResponse<ReviewResponse> getProductReviews(UUID productId, int page, int size) {
        Page<Review> reviewPage = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, PageRequest.of(page, size));

        List<ReviewResponse> content = reviewPage.getContent().stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());

        return PageResponse.<ReviewResponse>builder()
                .content(content)
                .page(reviewPage.getNumber())
                .size(reviewPage.getSize())
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .last(reviewPage.isLast())
                .first(reviewPage.isFirst())
                .build();
    }

    @Transactional
    public ReviewResponse createReview(UUID userId, UUID productId, ReviewRequest request) {
        if (reviewRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new BadRequestException("You have already reviewed this product");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);

        // Update product rating
        Double avgRating = reviewRepository.getAverageRatingByProductId(productId);
        Long reviewCount = reviewRepository.getReviewCountByProductId(productId);

        product.setRating(BigDecimal.valueOf(avgRating).setScale(1, RoundingMode.HALF_UP));
        product.setReviewCount(reviewCount.intValue());
        productRepository.save(product);

        return ReviewResponse.fromEntity(review);
    }
}
