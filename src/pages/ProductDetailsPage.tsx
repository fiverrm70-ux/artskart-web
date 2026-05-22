import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  FiAward,
  FiChevronDown,
  FiCheck,
  FiFeather,
  FiHeart,
  FiMail,
  FiPackage,
  FiShield,
  FiShoppingCart,
  FiTruck,
} from 'react-icons/fi';

import styles from './ProductDetailsPage.module.css';

import { products as fallbackProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  getAllProducts,
  getProductBySlug,
  getSortedProductGallery,
  type ApiProduct,
} from '../lib/productsApi';
import { useLiveCurrency } from '../utils/useLiveCurrency';

type MobileInfoKey = 'story' | 'details' | 'craft' | null;

type DetailsProduct = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  gallery: string[];
  edition: string;
  size: string;
  material: string;
  printQuality: string;
  packaging: string;
  stock: number;
  comparePrice?: number | null;
  basePriceUsd: number;
  category: 'heritage' | 'landscapes' | 'portraits';
  story: string;
  details: { label: string; value: string }[];
  materials: string[];
  craftMaterials: string[];
  certificatePoints: string[];
  careGuidance: string[];
  framingSupport: string;
  serviceNotes: string;
  reviews: { name: string; text: string }[];
};

const defaultReviews = [
  {
    name: 'Ananya R.',
    text: 'Beautiful print quality. Looks even better in person.',
  },
  {
    name: 'Rahul S.',
    text: 'Packaging was excellent and the artwork feels truly premium.',
  },
  {
    name: 'Meera K.',
    text: 'The colors and finishing feel refined and premium.',
  },
];

const fallbackProduct: DetailsProduct = {
  id: fallbackProducts[0].id,
  title: fallbackProducts[0].title,
  slug: fallbackProducts[0].slug,
  description: fallbackProducts[0].description,
  image: fallbackProducts[0].image,
  gallery: fallbackProducts[0].gallery,
  edition: 'Premium Artwork',
  size: '13 × 19 inches',
  material: 'Unframed Fine Art Print',
  printQuality: '300 GSM Archival Paper',
  packaging: 'Protective packaging',
  stock: fallbackProducts[0].stock,
  comparePrice: null,
  basePriceUsd: fallbackProducts[0].basePriceUsd,
  category: fallbackProducts[0].category,
  story: fallbackProducts[0].story,
  details: [
    { label: 'Style', value: 'Indian Traditional' },
    { label: 'Theme', value: 'Divinity, heritage and balance' },
    { label: 'Size', value: '13 × 19 inches' },
    { label: 'Material', value: '300 GSM archival paper' },
  ],
  materials: [
    '300 GSM archival quality paper',
    'Protective sleeve',
    'Secure courier packaging',
  ],
  craftMaterials: [
    'Print — 300 GSM archival quality paper',
    'Protection Sleeve — moisture-safe protection',
    'Packaging — secure courier packaging',
  ],
  certificatePoints: [
    'Thank you card included',
    'Hand-signed Certificate of Authenticity',
    'Signed and numbered artwork',
    'Artskart authenticity seal',
  ],
  careGuidance: [
    'Keep away from direct sunlight',
    'Frame under glass for archival protection',
    'Handle with clean, dry hands',
    'Store flat in protective sleeve when not framed',
  ],
  framingSupport:
    'Framing advice and curated frame suggestions will be shared after purchase based on your region.',
  serviceNotes:
    'Produced in small batches for consistency, quality, and attention to detail.',
  reviews: defaultReviews,
};

const normalizeCategory = (
  category?: string,
): 'heritage' | 'landscapes' | 'portraits' => {
  if (category === 'landscapes' || category === 'portraits') return category;
  return 'heritage';
};

const splitLines = (value?: string | null, fallback: string[] = []) => {
  if (!value) return fallback;
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildProductGallery = (product: ApiProduct) => {
  const sortedGallery = getSortedProductGallery(product);
  if (sortedGallery.length > 0) return sortedGallery;
  return product.imageUrl ? [product.imageUrl] : [];
};

const mapApiProductToDetails = (product: ApiProduct): DetailsProduct => {
  const gallery = buildProductGallery(product);
  const mainImage = gallery[0] || product.imageUrl;

  const reviewsFromAdmin = splitLines(product.reviewNotes).map(
    (review, index) => ({
      name: ['Ananya R.', 'Rahul S.', 'Meera K.', 'Arjun M.'][index % 4],
      text: review,
    }),
  );

  const craftItems = splitLines(product.craftMaterials, [
    'Print — 300 GSM archival quality paper',
    'Protection Sleeve — moisture-safe protection',
    'Packaging — secure courier packaging',
  ]);

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.shortDescription || product.description,
    image: mainImage,
    gallery: gallery.length > 0 ? gallery : [mainImage],
    edition: 'Premium Artwork',
    size: product.artworkSize || product.sku || '13 × 19 inches',
    material: product.artworkMaterial || 'Unframed Fine Art Print',
    printQuality: product.printQuality || '300 GSM Archival Paper',
    packaging: product.packaging || 'Protective packaging',
    stock: product.stock,
    comparePrice: product.comparePrice,
    basePriceUsd: product.price,
    category: normalizeCategory(product.category?.slug),
    story:
      product.productStory ||
      product.description ||
      'A premium artwork curated for refined interiors, collector walls and timeless spaces.',
    details: [
      {
        label: 'Style',
        value:
          product.detailStyle || product.category?.name || 'Indian Traditional',
      },
      {
        label: 'Theme',
        value: product.detailTheme || 'Heritage, divinity and timeless beauty',
      },
      {
        label: 'Size',
        value: product.detailSize || product.artworkSize || '13 × 19 inches',
      },
      {
        label: 'Material',
        value:
          product.detailMaterial ||
          product.printQuality ||
          '300 GSM archival paper',
      },
    ],
    materials: craftItems,
    craftMaterials: craftItems,
    certificatePoints: splitLines(product.certificatePoints, [
      'Thank you card included',
      'Hand-signed Certificate of Authenticity',
      'Signed and numbered artwork',
      'Artskart authenticity seal',
    ]),
    careGuidance: splitLines(product.careGuidance, [
      'Keep away from direct sunlight',
      'Frame under glass for archival protection',
      'Handle with clean, dry hands',
      'Store flat in protective sleeve when not framed',
    ]),
    framingSupport:
      product.framingSupport ||
      'Framing advice and curated frame suggestions will be shared after purchase based on your region.',
    serviceNotes:
      product.serviceNotes ||
      'Produced in small batches for consistency, quality, and attention to detail.',
    reviews: reviewsFromAdmin.length > 0 ? reviewsFromAdmin : defaultReviews,
  };
};

function ProductDetailsPage() {
  const { slug } = useParams();

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState<DetailsProduct>(fallbackProduct);
  const [relatedProducts, setRelatedProducts] = useState<DetailsProduct[]>([]);
  const [activeImage, setActiveImage] = useState(fallbackProduct.gallery[0]);
  const [openMobileInfo, setOpenMobileInfo] = useState<MobileInfoKey>('story');

  const { currency, loading, price } = useLiveCurrency();

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;

      try {
        const data = await getProductBySlug(slug);
        const mappedProduct = mapApiProductToDetails(data);

        setProduct(mappedProduct);
        setActiveImage(mappedProduct.gallery[0]);

        const allProducts = await getAllProducts();

        setRelatedProducts(
          allProducts
            .filter((item) => item.slug !== slug)
            .slice(0, 4)
            .map(mapApiProductToDetails),
        );
      } catch (error) {
        console.error('Failed to load product details:', error);
      }
    };

    loadProduct();
  }, [slug]);

  const localPrice = loading ? 'Calculating...' : price(product.basePriceUsd);
  const compareLocalPrice =
    product.comparePrice && product.comparePrice > product.basePriceUsd
      ? price(product.comparePrice)
      : null;

  const repeatedReviews = useMemo(
    () => [...product.reviews, ...product.reviews],
    [product.reviews],
  );

  const activeWishlist = isWishlisted(product.id);

  const toggleMobileInfo = (key: Exclude<MobileInfoKey, null>) => {
    setOpenMobileInfo((current) => (current === key ? null : key));
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <main className={styles.productPage}>
      <section className={styles.heroWrap}>
        <div className={styles.galleryColumn}>
          <div className={styles.thumbRail}>
            {product.gallery.map((image, index) => (
              <button
                key={`${image}-thumb-${index}`}
                type="button"
                className={activeImage === image ? styles.activeThumb : ''}
                onClick={() => setActiveImage(image)}
              >
                <img src={image} alt={product.title} />
              </button>
            ))}
          </div>

          <div className={styles.imageStage}>
            <button
              type="button"
              className={`${styles.wishlistFloating} ${
                activeWishlist ? styles.wishlistActive : ''
              }`}
              onClick={() => toggleWishlist(product)}
              aria-label={
                activeWishlist ? 'Remove from wishlist' : 'Add to wishlist'
              }
            >
              <FiHeart />
            </button>

            <img src={activeImage} alt={product.title} />
          </div>
        </div>

        <aside className={styles.purchasePanel}>
          <h1>{product.title}</h1>

          <div className={styles.ratingRow}>
            <span>★★★★★</span>
            <small>(12 reviews)</small>
          </div>

          <p className={styles.shortDesc}>{product.description}</p>

          <div className={styles.iconFeatures}>
            <div>
              <FiAward />
              <span>Museum Quality</span>
            </div>
            <div>
              <FiTruck />
              <span>Fast Delivery</span>
            </div>
            <div>
              <FiShield />
              <span>Secure Packaging</span>
            </div>
          </div>

          <div className={styles.stockBox}>
            <span />
            <strong>Only {product.stock} pieces left in this batch</strong>
          </div>

          <div className={styles.priceBlock}>
            <small>USD ${product.basePriceUsd}.00</small>
            <strong>{localPrice}</strong>
            {compareLocalPrice && <del>{compareLocalPrice}</del>}
            <p>
              Live price in {currency}. Price updated using real-time
              conversion.
            </p>
          </div>

          <div className={styles.quantityLine}>
            <span>Quantity</span>
            <button type="button">−</button>
            <strong>1</strong>
            <button type="button">+</button>
          </div>

          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.cartBtn}
              onClick={handleAddToCart}
            >
              <FiShoppingCart /> Add to Cart
            </button>

            <button
              type="button"
              className={`${styles.likeBtn} ${
                activeWishlist ? styles.likeBtnActive : ''
              }`}
              onClick={() => toggleWishlist(product)}
            >
              <FiHeart />
            </button>
          </div>
        </aside>
      </section>

      <section className={styles.serviceStrip}>
        <article>
          <FiTruck />
          <div>
            <strong>Free shipping</strong>
            <p>
              Prices are listed at base value. Customs duties may apply based on
              delivery destination.
            </p>
          </div>
        </article>

        <article>
          <FiFeather />
          <div>
            <strong>Eco-conscious materials</strong>
            <p>Responsibly sourced, premium materials for lasting beauty.</p>
          </div>
        </article>

        <article>
          <FiShield />
          <div>
            <strong>Protective packaging</strong>
            <p>Each artwork is securely packed with care and precision.</p>
          </div>
        </article>
      </section>

      <section className={styles.infoSupportGrid}>
        <div className={styles.mobileAccordionCard}>
          <article className={styles.infoAccordionItem}>
            <button type="button" onClick={() => toggleMobileInfo('story')}>
              <span>Story</span>
              <FiChevronDown />
            </button>

            <div
              className={`${styles.infoContent} ${
                openMobileInfo === 'story' ? styles.infoContentOpen : ''
              }`}
            >
              <p>{product.story}</p>
            </div>
          </article>

          <article className={styles.infoAccordionItem}>
            <button type="button" onClick={() => toggleMobileInfo('details')}>
              <span>Details</span>
              <FiChevronDown />
            </button>

            <div
              className={`${styles.infoContent} ${
                openMobileInfo === 'details' ? styles.infoContentOpen : ''
              }`}
            >
              <dl>
                {product.details.map((detail) => (
                  <div key={detail.label}>
                    <dt>{detail.label}</dt>
                    <dd>{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>

          <article className={styles.infoAccordionItem}>
            <button type="button" onClick={() => toggleMobileInfo('craft')}>
              <span>Craft & Materials</span>
              <FiChevronDown />
            </button>

            <div
              className={`${styles.infoContent} ${
                openMobileInfo === 'craft' ? styles.infoContentOpen : ''
              }`}
            >
              <ul>
                {product.craftMaterials.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        <article className={styles.supportCard}>
          <FiPackage />
          <h2>Care Guidance</h2>
          <ul>
            {product.careGuidance.map((item) => (
              <li key={item}>
                <FiCheck />
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.supportCard}>
          <FiMail />
          <h2>Framing Support</h2>
          <p>{product.framingSupport}</p>
        </article>
      </section>

      <section className={styles.certificateCard}>
        <div>
          <FiAward />
          <h2>Certificate of Authenticity</h2>
        </div>

        <ul>
          {product.certificatePoints.map((item) => (
            <li key={item}>
              <FiCheck />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.bottomGrid}>
        <div className={styles.reviewSection}>
          <div className={styles.reviewHeader}>
            <div>
              <h2>What Collectors Are Saying</h2>
              <p>Verified Artskart collectors</p>
            </div>
            <Link to="/reviews">View all reviews →</Link>
          </div>

          <div className={styles.reviewMarquee}>
            <div className={styles.reviewTrack}>
              {repeatedReviews.map((review, index) => (
                <article
                  className={styles.reviewCard}
                  key={`${review.name}-${index}`}
                >
                  <div>★★★★★</div>
                  <p>“{review.text}”</p>
                  <strong>— {review.name}</strong>
                  <span>Purchased from Artskart</span>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.reviewStats}>
            <div>
              <strong>128+</strong>
              <span>Verified Reviews</span>
            </div>
            <div>
              <strong>4.9</strong>
              <span>Average Rating</span>
            </div>
            <div>
              <strong>100</strong>
              <span>Limited Series</span>
            </div>
            <div>
              <strong>Zero</strong>
              <span>Mass Reprints</span>
            </div>
          </div>
        </div>

        <div className={styles.relatedSection}>
          <div className={styles.reviewHeader}>
            <div>
              <h2>You May Also Love</h2>
              <p>Curated artworks from nearby collections</p>
            </div>
            <Link to="/shop">View all →</Link>
          </div>

          <div className={styles.relatedGrid}>
            {relatedProducts.map((item) => (
              <Link
                to={`/product/${item.slug}`}
                className={styles.relatedCard}
                key={item.id}
              >
                <img src={item.image} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <span>{price(item.basePriceUsd)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetailsPage;
