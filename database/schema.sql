-- =============================================
-- AuraCart — Supabase PostgreSQL Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER' CHECK (role IN ('ROLE_USER', 'ROLE_ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    discount_price DECIMAL(10, 2) CHECK (discount_price >= 0),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_created ON products(created_at DESC);

-- =============================================
-- PRODUCT IMAGES TABLE
-- =============================================
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- =============================================
-- PRODUCT VARIANTS TABLE
-- =============================================
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_type VARCHAR(50) NOT NULL CHECK (variant_type IN ('COLOR', 'SIZE', 'MATERIAL')),
    variant_value VARCHAR(100) NOT NULL,
    price_modifier DECIMAL(10, 2) DEFAULT 0,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);

-- =============================================
-- CARTS TABLE
-- =============================================
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_carts_user ON carts(user_id);

-- =============================================
-- CART ITEMS TABLE
-- =============================================
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cart_id, product_id, variant_id)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' 
        CHECK (status IN ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    shipping_address TEXT NOT NULL,
    phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =============================================
-- WISHLISTS TABLE
-- =============================================
CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user ON wishlists(user_id);

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- =============================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SEED DATA
-- =============================================

-- Seed categories
INSERT INTO categories (id, name, slug, description, image_url) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567801', 'Audio', 'audio', 'Premium headphones, earbuds, and speakers', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567802', 'Wearables', 'wearables', 'Smart watches and fitness trackers', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567803', 'Footwear', 'footwear', 'Premium sneakers and lifestyle shoes', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567804', 'Bags', 'bags', 'Backpacks, messenger bags, and accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567805', 'Desk Accessories', 'desk-accessories', 'Minimal desk setups and accessories', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400');

-- Seed products
INSERT INTO products (id, name, slug, description, price, discount_price, category_id, stock, rating, review_count, featured, image_url) VALUES
    -- Audio
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567801', 'AuraSound Pro Max', 'aurasound-pro-max', 'Premium over-ear headphones with active noise cancellation, spatial audio, and 40-hour battery life. Crafted with aerospace-grade aluminum and memory foam cushions.', 549.00, 499.00, 'a1b2c3d4-e5f6-7890-abcd-ef1234567801', 50, 4.8, 234, TRUE, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567802', 'AuraBuds Elite', 'aurabuds-elite', 'True wireless earbuds with adaptive EQ, transparency mode, and premium sound. IPX5 water resistant with wireless charging case.', 299.00, NULL, 'a1b2c3d4-e5f6-7890-abcd-ef1234567801', 120, 4.6, 189, TRUE, 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567803', 'AuraWave Speaker', 'aurawave-speaker', 'Portable Bluetooth speaker with 360° immersive sound, 20-hour battery, and IP67 waterproof rating. Minimalist design meets powerful acoustics.', 199.00, 179.00, 'a1b2c3d4-e5f6-7890-abcd-ef1234567801', 75, 4.5, 156, FALSE, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567804', 'AuraStudio Monitor', 'aurastudio-monitor', 'Studio-grade reference headphones for audiophiles. Open-back design with 50mm beryllium drivers for unmatched clarity.', 899.00, NULL, 'a1b2c3d4-e5f6-7890-abcd-ef1234567801', 25, 4.9, 78, FALSE, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600'),
    -- Wearables
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567805', 'AuraWatch Ultra', 'aurawatch-ultra', 'Titanium smartwatch with always-on OLED display, advanced health monitoring, GPS, and 5-day battery. Sapphire crystal glass.', 799.00, 749.00, 'a1b2c3d4-e5f6-7890-abcd-ef1234567802', 40, 4.7, 312, TRUE, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567806', 'AuraWatch SE', 'aurawatch-se', 'Elegant smartwatch with essential health tracking, notifications, and 3-day battery. Aluminum body with interchangeable bands.', 399.00, 349.00, 'a1b2c3d4-e5f6-7890-abcd-ef1234567802', 80, 4.5, 267, FALSE, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567807', 'AuraFit Band', 'aurafit-band', 'Sleek fitness tracker with heart rate monitoring, sleep tracking, and 10-day battery. Lightweight and comfortable for all-day wear.', 149.00, NULL, 'a1b2c3d4-e5f6-7890-abcd-ef1234567802', 200, 4.3, 445, FALSE, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567808', 'AuraRing Smart', 'auraring-smart', 'Discreet smart ring with health monitoring, contactless payments, and 7-day battery. Titanium construction.', 349.00, 299.00, 'a1b2c3d4-e5f6-7890-abcd-ef1234567802', 60, 4.4, 123, TRUE, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600'),
    -- Footwear
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567809', 'AuraStep Velocity', 'aurastep-velocity', 'Ultra-lightweight running shoes with responsive foam, breathable knit upper, and carbon fiber plate. Designed for speed.', 279.00, 249.00, 'a1b2c3d4-e5f6-7890-abcd-ef1234567803', 90, 4.6, 198, TRUE, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567810', 'AuraStep Classic', 'aurastep-classic', 'Timeless lifestyle sneakers with premium leather, cushioned sole, and minimal design. Perfect for everyday elegance.', 199.00, NULL, 'a1b2c3d4-e5f6-7890-abcd-ef1234567803', 150, 4.7, 334, FALSE, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567811', 'AuraStep Drift', 'aurastep-drift', 'Cloud-like comfort sneakers with memory foam insole and slip-on design. Sustainable materials meet modern aesthetics.', 169.00, 149.00, 'a1b2c3d4-e5f6-7890-abcd-ef1234567803', 110, 4.4, 212, FALSE, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567812', 'AuraStep High', 'aurastep-high', 'Premium high-top sneakers with Italian leather, reinforced ankle support, and vintage-inspired design.', 329.00, NULL, 'a1b2c3d4-e5f6-7890-abcd-ef1234567803', 45, 4.8, 89, TRUE, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600'),
    -- Bags
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567813', 'AuraPack Pro', 'aurapack-pro', 'Tech-forward backpack with padded laptop compartment, USB charging port, water-resistant fabric, and ergonomic design.', 249.00, 219.00, 'a1b2c3d4-e5f6-7890-abcd-ef1234567804', 65, 4.6, 178, TRUE, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567814', 'AuraSling Essential', 'aurasling-essential', 'Minimal crossbody sling bag with RFID-blocking pocket, quick-access compartments, and water-resistant nylon.', 89.00, NULL, 'a1b2c3d4-e5f6-7890-abcd-ef1234567804', 180, 4.3, 267, FALSE, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567815', 'AuraTote Weekend', 'auratote-weekend', 'Spacious weekend tote with premium canvas, leather accents, and organized interior. Carries your essentials in style.', 179.00, 159.00, 'a1b2c3d4-e5f6-7890-abcd-ef1234567804', 55, 4.5, 134, FALSE, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567816', 'AuraBrief Executive', 'aurabrief-executive', 'Executive briefcase with Italian leather, secure laptop sleeve, and professional aesthetics. For the modern professional.', 449.00, NULL, 'a1b2c3d4-e5f6-7890-abcd-ef1234567804', 30, 4.8, 56, TRUE, 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600'),
    -- Desk Accessories
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567817', 'AuraDesk Stand', 'auradesk-stand', 'Adjustable laptop stand with aerospace aluminum, cable management, and ventilation design. Elevate your workspace.', 129.00, 109.00, 'a1b2c3d4-e5f6-7890-abcd-ef1234567805', 100, 4.5, 223, TRUE, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567818', 'AuraPad Wireless Charger', 'aurapad-wireless-charger', 'Premium wireless charging pad with fast charge, LED indicator, and anti-slip base. Compatible with all Qi devices.', 69.00, NULL, 'a1b2c3d4-e5f6-7890-abcd-ef1234567805', 250, 4.4, 345, FALSE, 'https://images.unsplash.com/photo-1586953208270-767889fa9b0e?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567819', 'AuraKey Mechanical', 'aurakey-mechanical', 'Premium mechanical keyboard with cherry switches, aluminum frame, RGB backlighting, and wireless connectivity.', 199.00, 179.00, 'a1b2c3d4-e5f6-7890-abcd-ef1234567805', 70, 4.7, 289, TRUE, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567820', 'AuraMouse Precision', 'auramouse-precision', 'Ergonomic wireless mouse with 8K DPI sensor, silent clicks, USB-C charging, and multi-device support.', 99.00, 89.00, 'a1b2c3d4-e5f6-7890-abcd-ef1234567805', 130, 4.6, 198, FALSE, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600');

-- Seed product variants
INSERT INTO product_variants (product_id, variant_type, variant_value, price_modifier, stock) VALUES
    -- AuraSound Pro Max colors
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567801', 'COLOR', 'Midnight Black', 0, 20),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567801', 'COLOR', 'Arctic White', 0, 15),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567801', 'COLOR', 'Space Gray', 0, 15),
    -- AuraBuds Elite colors
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567802', 'COLOR', 'Pearl White', 0, 40),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567802', 'COLOR', 'Onyx Black', 0, 40),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567802', 'COLOR', 'Sage Green', 20, 40),
    -- AuraWatch Ultra bands
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567805', 'COLOR', 'Natural Titanium', 0, 15),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567805', 'COLOR', 'Blue Titanium', 50, 10),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567805', 'SIZE', '41mm', 0, 20),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567805', 'SIZE', '45mm', 50, 20),
    -- AuraStep Velocity sizes
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567809', 'SIZE', 'US 7', 0, 15),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567809', 'SIZE', 'US 8', 0, 15),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567809', 'SIZE', 'US 9', 0, 15),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567809', 'SIZE', 'US 10', 0, 15),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567809', 'SIZE', 'US 11', 0, 15),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567809', 'SIZE', 'US 12', 0, 15),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567809', 'COLOR', 'Cloud White', 0, 30),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567809', 'COLOR', 'Core Black', 0, 30),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567809', 'COLOR', 'Signal Red', 0, 30),
    -- AuraPack Pro colors
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567813', 'COLOR', 'Charcoal', 0, 25),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567813', 'COLOR', 'Navy', 0, 20),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567813', 'COLOR', 'Olive', 0, 20),
    -- AuraKey Mechanical switches
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567819', 'MATERIAL', 'Cherry Red (Linear)', 0, 25),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567819', 'MATERIAL', 'Cherry Brown (Tactile)', 0, 25),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567819', 'MATERIAL', 'Cherry Blue (Clicky)', 0, 20);

-- Seed product images
INSERT INTO product_images (product_id, image_url, alt_text, sort_order) VALUES
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567801', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'AuraSound Pro Max front view', 0),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567801', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800', 'AuraSound Pro Max side view', 1),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567805', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'AuraWatch Ultra front', 0),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567805', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800', 'AuraWatch Ultra angle', 1),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567809', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'AuraStep Velocity side', 0),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567809', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', 'AuraStep Velocity top', 1),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567813', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'AuraPack Pro front', 0),
    ('b1b2c3d4-e5f6-7890-abcd-ef1234567819', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', 'AuraKey Mechanical top', 0);

-- Seed admin user (password: Admin@123)
-- Note: This bcrypt hash should be generated by the backend. Using placeholder.
-- The actual seeding will be done by the Spring Boot DataSeeder
