import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://backendapi-production-3b68.up.railway.app',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('artskart_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
