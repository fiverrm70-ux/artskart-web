import { api } from './api';

export type Product = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  price: number;
  stock: number;
  isActive: boolean;
};

export type CreateProductPayload = {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  imageUrl: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku?: string;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
};

export type CreateProductImagePayload = {
  imageUrl: string;
  altText?: string;
  sortOrder?: number;
};

export async function getProducts() {
  const response = await api.get<Product[]>('/products');
  return response.data;
}

export async function createProduct(payload: CreateProductPayload) {
  const response = await api.post<Product>('/products', payload);
  return response.data;
}

export async function addProductImage(
  productId: string,
  payload: CreateProductImagePayload,
) {
  const response = await api.post(`/products/${productId}/images`, payload);
  return response.data;
}
