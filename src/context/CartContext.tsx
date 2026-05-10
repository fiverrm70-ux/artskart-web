/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import toast from 'react-hot-toast';

import type { Product } from '../data/products';
import {
  addCartItem,
  clearMyCart,
  getMyCart,
  removeCartItem,
  updateCartItem,
} from '../lib/cartApi';
import { getSortedProductGallery, type ApiProduct } from '../lib/productsApi';

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  cartCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = 'artskart_cart';

const CartContext = createContext<CartContextValue | null>(null);

function loadCartItems(): CartItem[] {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? (JSON.parse(savedCart) as CartItem[]) : [];
  } catch {
    return [];
  }
}

const normalizeCategory = (
  category?: string,
): 'heritage' | 'landscapes' | 'portraits' => {
  if (category === 'landscapes' || category === 'portraits') {
    return category;
  }

  return 'heritage';
};

const mapApiProductToCartProduct = (product: ApiProduct): Product => {
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartItems);

  const isLoggedIn = Boolean(localStorage.getItem('artskart_token'));

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const loadBackendCart = async () => {
      const token = localStorage.getItem('artskart_token');

      if (!token) return;

      try {
        const data = await getMyCart();

        const mappedItems = data.map((item) => ({
          product: mapApiProductToCartProduct(item.product),
          quantity: item.quantity,
        }));

        setItems(mappedItems);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };

    loadBackendCart();
  }, [isLoggedIn]);

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const addToCart = async (product: Product, quantity = 1) => {
    const safeQuantity = Math.max(1, Math.min(quantity, product.stock));

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + safeQuantity, product.stock),
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          product,
          quantity: safeQuantity,
        },
      ];
    });

    const token = localStorage.getItem('artskart_token');

    if (token) {
      try {
        await addCartItem(product.id, safeQuantity);
      } catch (error) {
        console.error('Failed to sync cart:', error);
        toast.error('Could not sync cart');
        return;
      }
    }

    toast.success('Artwork added to cart');
  };

  const removeFromCart = async (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId),
    );

    const token = localStorage.getItem('artskart_token');

    if (token) {
      try {
        await removeCartItem(productId);
      } catch (error) {
        console.error('Failed to remove cart item:', error);
        toast.error('Could not sync cart');
        return;
      }
    }

    toast.success('Removed from cart');
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    let nextQuantity = quantity;

    const currentItem = items.find((item) => item.product.id === productId);

    if (currentItem) {
      nextQuantity = Math.max(1, Math.min(quantity, currentItem.product.stock));
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: nextQuantity,
            }
          : item,
      ),
    );

    const token = localStorage.getItem('artskart_token');

    if (token) {
      try {
        await updateCartItem(productId, nextQuantity);
      } catch (error) {
        console.error('Failed to update cart item:', error);
        toast.error('Could not sync cart');
      }
    }
  };

  const clearCart = async () => {
    setItems([]);

    const token = localStorage.getItem('artskart_token');

    if (token) {
      try {
        await clearMyCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
        toast.error('Could not sync cart');
      }
    }
  };

  const value = useMemo(
    () => ({
      items,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [items, cartCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
