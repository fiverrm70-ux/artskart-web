import { api } from './api';

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post<{
    url: string;
    publicId: string;
  }>('/upload/image', formData);

  return response.data;
}
