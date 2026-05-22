import { api } from './api';

export type Product = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku?: string;
  isActive: boolean;
  isFeatured: boolean;
  artworkSize?: string;
  artworkMaterial?: string;
  printQuality?: string;
  packaging?: string;
  productStory?: string;
  detailStyle?: string;
  detailTheme?: string;
  detailSize?: string;
  detailMaterial?: string;
  craftMaterials?: string;
  certificatePoints?: string;
  careGuidance?: string;
  framingSupport?: string;
  serviceNotes?: string;
  reviewNotes?: string;
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

  artworkSize?: string;
  artworkMaterial?: string;
  printQuality?: string;
  packaging?: string;
  productStory?: string;
  detailStyle?: string;
  detailTheme?: string;
  detailSize?: string;
  detailMaterial?: string;
  craftMaterials?: string;
  certificatePoints?: string;
  careGuidance?: string;
  framingSupport?: string;
  serviceNotes?: string;
  reviewNotes?: string;
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
