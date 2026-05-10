import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiSliders, FiZap } from 'react-icons/fi';

import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLiveCurrency } from '../utils/useLiveCurrency';
import { getAllProducts, type ApiProduct } from '../lib/productsApi';

import styles from './ShopPage.module.css';

type CategoryFilter = 'all' | 'heritage' | 'landscapes' | 'portraits';
type PriceFilter = 'all' | 'under150' | '150to180' | 'above180';
type SortFilter = 'newest' | 'lowToHigh' | 'highToLow';

type ShopProduct = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  edition: string;
  size: string;
  stock: number;
  basePriceUsd: number;
  category: Exclude<CategoryFilter, 'all'>;
};

const categories: { label: string; value: CategoryFilter }[] = [
  { label: 'All Artworks', value: 'all' },
  { label: 'Heritage', value: 'heritage' },
  { label: 'Landscapes', value: 'landscapes' },
  { label: 'Portraits', value: 'portraits' },
];

const priceRanges: { label: string; value: PriceFilter }[] = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under $150', value: 'under150' },
  { label: '$150 - $180', value: '150to180' },
  { label: 'Above $180', value: 'above180' },
];

const heroBanners: Record<
  CategoryFilter,
  {
    label: string;
    title: string;
    description: string;
    image: string;
  }
> = {
  all: {
    label: 'Curated Artworks',
    title: 'Shop Original Art Collections',
    description:
      'Discover premium limited-edition artworks designed for elegant homes, statement walls and collector spaces.',
    image:
      'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1800&q=90',
  },
  heritage: {
    label: 'Heritage Collection',
    title: 'Timeless Heritage Artworks',
    description:
      'Explore expressive artworks inspired by tradition, symbolism and refined collectible storytelling.',
    image:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1800&q=90',
  },
  landscapes: {
    label: 'Landscape Collection',
    title: 'Elegant Landscape Art Prints',
    description:
      'Bring visual calm, depth and atmosphere into curated interiors with premium landscape compositions.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=90',
  },
  portraits: {
    label: 'Portrait Collection',
    title: 'Refined Portrait Artworks',
    description:
      'Discover statement portrait artworks crafted for collectors, galleries and premium wall styling.',
    image:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1800&q=90',
  },
};

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function isCategoryFilter(value?: string): value is CategoryFilter {
  return (
    value === 'heritage' || value === 'landscapes' || value === 'portraits'
  );
}

function normalizeCategory(
  product: ApiProduct,
): Exclude<CategoryFilter, 'all'> {
  const raw = `${product.category?.slug ?? ''} ${product.category?.name ?? ''}`
    .toLowerCase()
    .trim();

  if (raw.includes('landscape')) return 'landscapes';
  if (raw.includes('portrait')) return 'portraits';
  if (raw.includes('heritage')) return 'heritage';

  return 'heritage';
}

const mapApiProduct = (product: ApiProduct): ShopProduct => {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.shortDescription || product.description,
    image: product.imageUrl,
    edition: 'Limited Edition',
    size: product.sku || product.category?.name || 'Fine Art Print',
    stock: product.stock,
    basePriceUsd: Number(product.price),
    category: normalizeCategory(product),
  };
};

function ShopPage() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  const { currency, rate } = useLiveCurrency();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [price, setPrice] = useState<PriceFilter>('all');
  const [sort, setSort] = useState<SortFilter>('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [animatingProductId, setAnimatingProductId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);

        const data = await getAllProducts();
        const activeProducts = data.filter(
          (product) => product.isActive !== false,
        );

        setProducts(activeProducts.map(mapApiProduct));
      } catch (error) {
        console.error('Failed to load shop products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (isCategoryFilter(categorySlug)) {
      setCategory(categorySlug);
    } else {
      setCategory('all');
    }
  }, [categorySlug]);

  const activeHero = heroBanners[category];

  const handleAddToCart = (product: ShopProduct) => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        slug: product.slug,
        image: product.image,
        edition: product.edition,
        size: product.size,
        stock: product.stock,
        description: product.description,
        basePriceUsd: product.basePriceUsd,
        category: product.category,
      },
      1,
    );

    setAnimatingProductId(product.id);

    window.setTimeout(() => {
      setAnimatingProductId(null);
    }, 900);
  };

  const handleBuyNow = (product: ShopProduct) => {
    handleAddToCart(product);

    window.setTimeout(() => {
      navigate('/cart');
    }, 450);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (category !== 'all') {
      list = list.filter((product) => product.category === category);
    }

    if (price === 'under150') {
      list = list.filter((product) => product.basePriceUsd < 150);
    }

    if (price === '150to180') {
      list = list.filter(
        (product) => product.basePriceUsd >= 150 && product.basePriceUsd <= 180,
      );
    }

    if (price === 'above180') {
      list = list.filter((product) => product.basePriceUsd > 180);
    }

    if (sort === 'lowToHigh') {
      list.sort((a, b) => a.basePriceUsd - b.basePriceUsd);
    }

    if (sort === 'highToLow') {
      list.sort((a, b) => b.basePriceUsd - a.basePriceUsd);
    }

    return list;
  }, [products, category, price, sort]);

  const renderFilters = () => (
    <div className={styles.filtersBox}>
      <div className={styles.filterGroup}>
        <h3>Collections</h3>

        <div className={styles.filterOptions}>
          {categories.map((item) => (
            <Link
              key={item.value}
              className={category === item.value ? styles.activeFilter : ''}
              to={item.value === 'all' ? '/shop' : `/shop/${item.value}`}
              onClick={() => {
                setCategory(item.value);
                setShowMobileFilters(false);
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <h3>Price Range</h3>

        <div className={styles.filterOptions}>
          {priceRanges.map((item) => (
            <button
              key={item.value}
              className={price === item.value ? styles.activeFilter : ''}
              onClick={() => setPrice(item.value)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterNote}>
        <span>Collector Note</span>

        <p>
          Each artwork is curated for refined interiors, premium gifting and
          collectible spaces.
        </p>
      </div>
    </div>
  );

  return (
    <main className={styles.shopPage}>
      <section
        className={styles.hero}
        style={{
          backgroundImage: `url(${activeHero.image})`,
        }}
      >
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <span>{activeHero.label}</span>
            <h1>{activeHero.title}</h1>
            <p>{activeHero.description}</p>
          </div>
        </div>
      </section>

      <section className={styles.mobileChips}>
        {categories.map((item) => (
          <Link
            key={item.value}
            className={category === item.value ? styles.activeChip : ''}
            to={item.value === 'all' ? '/shop' : `/shop/${item.value}`}
          >
            {item.label}
          </Link>
        ))}
      </section>

      <section className={styles.shopWrap}>
        <aside className={styles.sidebar}>{renderFilters()}</aside>

        <div className={styles.productsArea}>
          <div className={styles.toolbar}>
            <div>
              <span>Showing</span>
              <strong>{filteredProducts.length} artworks</strong>
            </div>

            <div className={styles.toolbarActions}>
              <button
                className={styles.mobileFilterButton}
                onClick={() => setShowMobileFilters((value) => !value)}
                type="button"
              >
                <FiSliders />
                Filters
              </button>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortFilter)}
              >
                <option value="newest">Newest</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {showMobileFilters && (
            <div className={styles.mobileFilters}>{renderFilters()}</div>
          )}

          <div className={styles.quickFilters}>
            {categories.slice(1).map((item) => (
              <Link
                key={item.value}
                className={category === item.value ? styles.activeQuick : ''}
                to={`/shop/${item.value}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {loadingProducts ? (
            <div className={styles.loadingState}>
              Loading premium artworks...
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredProducts.map((product) => {
                const localPrice = product.basePriceUsd * rate;
                const isAnimating = animatingProductId === product.id;
                const activeWishlist = isWishlisted(product.id);

                return (
                  <motion.article
                    className={styles.card}
                    key={product.id}
                    animate={
                      isAnimating
                        ? {
                            y: [0, -8, 0],
                            scale: [1, 1.02, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.45,
                      ease: 'easeOut',
                    }}
                  >
                    <AnimatePresence>
                      {isAnimating && (
                        <motion.div
                          className={styles.cartGlow}
                          initial={{
                            opacity: 0,
                            scale: 0.75,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 1.12,
                          }}
                          transition={{
                            duration: 0.55,
                          }}
                        >
                          Added to Cart
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Link
                      to={`/product/${product.slug}`}
                      className={styles.imageBox}
                    >
                      <img src={product.image} alt={product.title} />
                      <span>{product.edition}</span>
                    </Link>

                    <button
                      className={`${styles.wishlist} ${
                        activeWishlist ? styles.activeWishlist : ''
                      }`}
                      type="button"
                      aria-label={
                        activeWishlist
                          ? 'Remove from wishlist'
                          : 'Add to wishlist'
                      }
                      onClick={() => toggleWishlist(product)}
                    >
                      <FiHeart />
                    </button>

                    <div className={styles.cardBody}>
                      <p className={styles.category}>{product.category}</p>

                      <h2>{product.title}</h2>

                      <p className={styles.description}>
                        {product.description}
                      </p>

                      <div className={styles.priceRow}>
                        <strong>{formatMoney(localPrice, currency)}</strong>
                        <span>${product.basePriceUsd.toFixed(2)} USD</span>
                      </div>

                      <div className={styles.stockRow}>
                        <span>Only {product.stock} left</span>
                      </div>

                      <div className={styles.cardActions}>
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          type="button"
                          className={styles.addCartBtn}
                          onClick={() => handleAddToCart(product)}
                        >
                          <FiShoppingBag />
                          Add to Cart
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          type="button"
                          className={styles.buyBtn}
                          onClick={() => handleBuyNow(product)}
                        >
                          <FiZap />
                          Buy Now
                        </motion.button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default ShopPage;
