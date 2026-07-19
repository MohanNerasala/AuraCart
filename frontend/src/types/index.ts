// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  imageUrl: string;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  variantType: 'COLOR' | 'SIZE' | 'MATERIAL';
  variantValue: string;
  priceModifier: number;
  stock: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  itemCount?: number;
}

// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  productPrice: number;
  productDiscountPrice: number | null;
  variantId: string | null;
  variantType: string | null;
  variantValue: string | null;
  variantPriceModifier: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

// Order types
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantInfo: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: string;
  phone: string | null;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// API types
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  featured?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}
