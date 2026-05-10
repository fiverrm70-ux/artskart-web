import { api } from './api';
import type { ApiCategory } from './productsApi';

export async function getActiveCategories() {
  const response = await api.get<ApiCategory[]>('/categories/active');
  return response.data;
}

export async function getAllCategories() {
  const response = await api.get<ApiCategory[]>('/categories');
  return response.data;
}
