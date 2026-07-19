package com.auracart.seed;

import com.auracart.entity.*;
import com.auracart.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Arrays;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // Create admin user if not exists
        if (!userRepository.existsByEmail("admin@auracart.com")) {
            User admin = User.builder()
                    .email("admin@auracart.com")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .fullName("AuraCart Admin")
                    .role("ROLE_ADMIN")
                    .build();
            userRepository.save(admin);
        }

        // Create demo user if not exists
        if (!userRepository.existsByEmail("user@auracart.com")) {
            User user = User.builder()
                    .email("user@auracart.com")
                    .passwordHash(passwordEncoder.encode("User@123"))
                    .fullName("Demo User")
                    .role("ROLE_USER")
                    .build();
            userRepository.save(user);
        }

        seedCategoriesAndProducts();
        log.info("Data seeding completed. 20 products per category have been generated!");
    }

    private void seedCategoriesAndProducts() {
        if (categoryRepository.count() == 0) {
            log.info("Seeding initial categories...");
            List<Category> categories = Arrays.asList(
                Category.builder().name("Audio").slug("audio").description("Premium headphones, earbuds, and speakers").imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800").build(),
                Category.builder().name("Wearables").slug("wearables").description("Smart watches and fitness trackers").imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800").build(),
                Category.builder().name("Footwear").slug("footwear").description("Premium sneakers and lifestyle shoes").imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800").build(),
                Category.builder().name("Bags").slug("bags").description("Backpacks, messenger bags, and accessories").imageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800").build(),
                Category.builder().name("Desk Accessories").slug("desk-accessories").description("Minimal desk setups and accessories").imageUrl("https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800").build()
            );
            categoryRepository.saveAll(categories);
        }

        List<Category> allCategories = categoryRepository.findAll();
        Random random = new Random();

        for (Category category : allCategories) {
            long productCount = productRepository.countByCategoryId(category.getId());
            if (productCount < 20) {
                log.info("Seeding products for category: {}. Current count: {}, target: 20", category.getName(), productCount);
                int needed = (int) (20 - productCount);
                for (int i = 1; i <= needed; i++) {
                    String productName = "Premium " + category.getName() + " Collection Model " + (productCount + i);
                    String slug = category.getSlug() + "-model-" + (productCount + i) + "-" + System.currentTimeMillis();
                    
                    BigDecimal price = BigDecimal.valueOf(50 + random.nextInt(450) + 0.99);
                    BigDecimal discount = random.nextBoolean() ? price.multiply(BigDecimal.valueOf(0.8)).setScale(2, java.math.RoundingMode.HALF_UP) : null;
                    
                    String[] categoryImages = getImagesForCategory(category.getName());
                    String imageUrl = categoryImages[random.nextInt(categoryImages.length)];
                    
                    Product product = Product.builder()
                            .name(productName)
                            .slug(slug)
                            .description("This is a high-quality " + category.getName().toLowerCase() + " item that combines elegant design with superior functionality. Crafted with premium materials for the ultimate experience.")
                            .price(price)
                            .discountPrice(discount)
                            .category(category)
                            .stock(random.nextInt(100) + 10)
                            .rating(BigDecimal.valueOf(4.0 + random.nextDouble()).setScale(1, java.math.RoundingMode.HALF_UP))
                            .reviewCount(random.nextInt(500) + 10)
                            .featured(random.nextInt(10) > 7) // ~20% chance to be featured
                            .imageUrl(imageUrl)
                            .build();
                            
                    productRepository.save(product);
                }
            }
        }

        // Sweep to fix broken images in existing products
        log.info("Updating existing product images to ensure no broken links...");
        List<Product> allProducts = productRepository.findAll();
        for (Product product : allProducts) {
            String[] validImages = getImagesForCategory(product.getCategory().getName());
            product.setImageUrl(validImages[random.nextInt(validImages.length)]);
        }
        productRepository.saveAll(allProducts);
        log.info("Finished updating all product images.");
    }

    private String[] getImagesForCategory(String categoryName) {
        switch (categoryName) {
            case "Audio":
                return new String[]{
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", // Black headphones
                    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800", // Grey headphones
                    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800", // Airpods
                    "https://images.unsplash.com/photo-1572569531086-6bd4b62dbd66?w=800"  // Earbuds
                };
            case "Wearables":
                return new String[]{
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", // Apple watch
                    "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800", // Apple watch black
                    "https://images.unsplash.com/photo-1508685002322-8618a8047970?w=800", // Smart watch
                    "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800"  // Watch
                };
            case "Footwear":
                return new String[]{
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", // Red Nike
                    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800", // White Nike
                    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800", // Sneaker
                    "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800"  // Shoe
                };
            case "Bags":
                return new String[]{
                    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800", // Yellow backpack
                    "https://images.unsplash.com/photo-1491637632524-70f12f06631b?w=800", // Leather bag
                    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800", // Black backpack
                    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"  // Bag
                };
            case "Desk Accessories":
                return new String[]{
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800", // Desk
                    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800", // Mouse
                    "https://images.unsplash.com/photo-1586953208270-767889fa9b0e?w=800", // Keyboard
                    "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=800"  // Desk setup
                };
            default:
                return new String[]{
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
                };
        }
    }
}
