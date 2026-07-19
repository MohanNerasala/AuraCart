import api from './client';
import type { Product, PageResponse, ProductFilters, Category } from '../types';

export const productsApi = {
  getProducts: async (filters: ProductFilters = {}): Promise<PageResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
    if (filters.minRating !== undefined) params.append('minRating', String(filters.minRating));
    if (filters.featured !== undefined) params.append('featured', String(filters.featured));
    params.append('page', String(filters.page || 0));
    params.append('size', String(filters.size || 12));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDir) params.append('sortDir', filters.sortDir);

    const { data } = await api.get(`/products?${params.toString()}`);
    return data;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const { data } = await api.get(`/products/${slug}`);
    return data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const { data } = await api.get('/products/featured');
    return data;
  },

  getRelatedProducts: async (productId: string, categoryId: string): Promise<Product[]> => {
    const { data } = await api.get(`/products/${productId}/related?categoryId=${categoryId}`);
    return data;
  },
};

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data;
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const { data } = await api.get(`/categories/${slug}`);
    return data;
  },
};
