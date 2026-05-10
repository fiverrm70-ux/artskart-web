import { api } from './api';
import type { ApiProduct } from './productsApi';

export type ApiWishlistItem = {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: ApiProduct;
};

export async function getMyWishlist() {
  const response = await api.get<ApiWishlistItem[]>('/wishlist');
  return response.data;
}

export async function addWishlistItem(productId: string) {
  const response = await api.post<ApiWishlistItem>('/wishlist', {
    productId,
  });
  return response.data;
}

export async function removeWishlistItem(productId: string) {
  const response = await api.delete<{ message: string }>(
    `/wishlist/${productId}`,
  );
  return response.data;
}
