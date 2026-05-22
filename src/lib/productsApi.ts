import { api } from './api';

export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
};

export type ApiProductImage = {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiProduct = {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  imageUrl: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  sku?: string | null;
  isFeatured: boolean;
  isActive: boolean;

  artworkSize?: string | null;
  artworkMaterial?: string | null;
  printQuality?: string | null;
  packaging?: string | null;
  productStory?: string | null;
  detailStyle?: string | null;
  detailTheme?: string | null;
  detailSize?: string | null;
  detailMaterial?: string | null;
  craftMaterials?: string | null;
  certificatePoints?: string | null;
  careGuidance?: string | null;
  framingSupport?: string | null;
  serviceNotes?: string | null;
  reviewNotes?: string | null;

  categoryId: string;
  category?: ApiCategory;
  images?: ApiProductImage[];
};

export async function getFeaturedProducts() {
  const response = await api.get<ApiProduct[]>('/products/featured');
  return response.data;
}

export async function getAllProducts() {
  const response = await api.get<ApiProduct[]>('/products');
  return response.data;
}

export async function getProductBySlug(slug: string) {
  const response = await api.get<ApiProduct>(`/products/${slug}`);
  return response.data;
}

export async function getProductImages(productId: string) {
  const response = await api.get<ApiProductImage[]>(
    `/products/${productId}/images`,
  );
  return response.data;
}

export function getSortedProductGallery(product: ApiProduct): string[] {
  const galleryImages =
    product.images
      ?.slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => item.imageUrl)
      .filter(Boolean) ?? [];

  if (galleryImages.length > 0) {
    return galleryImages;
  }

  return product.imageUrl ? [product.imageUrl] : [];
}
