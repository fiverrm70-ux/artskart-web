import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';

import { products } from '../data/products';
import {
  addWishlistItem,
  getMyWishlist,
  removeWishlistItem,
} from '../lib/wishlistApi';
import { getSortedProductGallery, type ApiProduct } from '../lib/productsApi';

const WISHLIST_KEY = 'artskart_wishlist';

type Product = (typeof products)[number];

type WishlistContextType = {
  wishlistIds: string[];
  wishlistItems: Product[];
  wishlistCount: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

const normalizeCategory = (
  category?: string,
): 'heritage' | 'landscapes' | 'portraits' => {
  if (category === 'landscapes' || category === 'portraits') {
    return category;
  }

  return 'heritage';
};

const mapApiProductToWishlistProduct = (product: ApiProduct): Product => {
  const gallery = getSortedProductGallery(product);
  const mainImage = gallery[0] || product.imageUrl;

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    category: normalizeCategory(product.category?.slug),
    basePriceUsd: product.price,
    image: mainImage,
    gallery: gallery.length > 0 ? gallery : [mainImage],
    edition: '100 Prints Only',
    stock: product.stock,
    description: product.shortDescription || product.description,
    story:
      product.description ||
      'A premium artwork curated for refined interiors and collector spaces.',
    details: [
      { label: 'Artwork Type', value: 'Premium Fine Art Print' },
      { label: 'Collection', value: product.category?.name || 'Artskart' },
    ],
    materials: [
      'Museum-grade fine art paper',
      'Archival quality pigment print',
      'Premium protective packaging',
    ],
  };
};

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [backendWishlistItems, setBackendWishlistItems] = useState<Product[]>(
    [],
  );

  const isLoggedIn = Boolean(localStorage.getItem('artskart_token'));

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    const loadWishlist = async () => {
      const token = localStorage.getItem('artskart_token');

      if (!token) return;

      try {
        const data = await getMyWishlist();
        const mappedProducts = data.map((item) =>
          mapApiProductToWishlistProduct(item.product),
        );

        setBackendWishlistItems(mappedProducts);
        setWishlistIds(mappedProducts.map((product) => product.id));
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      }
    };

    loadWishlist();
  }, [isLoggedIn]);

  const localWishlistItems = useMemo(
    () => products.filter((product) => wishlistIds.includes(product.id)),
    [wishlistIds],
  );

  const wishlistItems =
    backendWishlistItems.length > 0 ? backendWishlistItems : localWishlistItems;

  const addToWishlist = async (product: Product) => {
    if (wishlistIds.includes(product.id)) return;

    setWishlistIds((prev) => [...prev, product.id]);
    setBackendWishlistItems((prev) => [...prev, product]);

    const token = localStorage.getItem('artskart_token');

    if (token) {
      try {
        await addWishlistItem(product.id);
      } catch (error) {
        console.error('Failed to add wishlist item:', error);
        toast.error('Could not sync wishlist');
        return;
      }
    }

    toast.success('Added to wishlist');
  };

  const removeFromWishlist = async (productId: string) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
    setBackendWishlistItems((prev) =>
      prev.filter((product) => product.id !== productId),
    );

    const token = localStorage.getItem('artskart_token');

    if (token) {
      try {
        await removeWishlistItem(productId);
      } catch (error) {
        console.error('Failed to remove wishlist item:', error);
        toast.error('Could not sync wishlist');
        return;
      }
    }

    toast.success('Removed from wishlist');
  };

  const toggleWishlist = (product: Product) => {
    if (wishlistIds.includes(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  const value: WishlistContextType = {
    wishlistIds,
    wishlistItems,
    wishlistCount: wishlistIds.length,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isWishlisted,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used inside WishlistProvider');
  }

  return context;
}
