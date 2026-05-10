import { api } from './api';
import type { ApiProduct } from './productsApi';

export type ApiCartItem = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: ApiProduct;
};

export async function getMyCart() {
  const response = await api.get<ApiCartItem[]>('/cart');
  return response.data;
}

export async function addCartItem(productId: string, quantity = 1) {
  const response = await api.post<ApiCartItem>('/cart', {
    productId,
    quantity,
  });
  return response.data;
}

export async function updateCartItem(productId: string, quantity: number) {
  const response = await api.patch<ApiCartItem>(`/cart/${productId}`, {
    quantity,
  });
  return response.data;
}

export async function removeCartItem(productId: string) {
  const response = await api.delete<{ message: string }>(`/cart/${productId}`);
  return response.data;
}

export async function clearMyCart() {
  const response = await api.delete<{ message: string }>('/cart');
  return response.data;
}
