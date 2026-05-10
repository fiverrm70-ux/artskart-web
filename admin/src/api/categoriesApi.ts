import { api } from './api';

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export async function getCategories() {
  const response = await api.get<Category[]>('/categories');
  return response.data;
}
