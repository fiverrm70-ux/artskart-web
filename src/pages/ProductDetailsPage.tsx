import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FiAward,
  FiBox,
  FiChevronDown,
  FiFeather,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShield,
  FiShoppingBag,
  FiStar,
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

type AccordionKey = 'story' | 'details' | 'materials' | null;

type DetailsProduct = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  gallery: string[];
  edition: string;
  size: string;
  stock: number;
  basePriceUsd: number;
  category: 'heritage' | 'landscapes' | 'portraits';
  story: string;
  details: { label: string; value: string }[];
  materials: string[];
};

const reviews = [
  {
    name: 'Rahul S.',
    text: 'Beautiful print quality. Looks even better in person.',
  },
  {
    name: 'Meera K.',
    text: 'The gold detailing and colors are absolutely stunning.',
  },
  {
    name: 'Arjun M.',
    text: 'Packaging was excellent and the artwork feels truly premium.',
  },
  {
    name: 'Ananya R.',
    text: 'A premium artwork that completely elevated our space.',
  },
];

const fallbackProduct: DetailsProduct = {
  size: 'Fine Art Print',
  ...fallbackProducts[0],
  category: fallbackProducts[0].category,
};

const normalizeCategory = (
  category?: string,
): 'heritage' | 'landscapes' | 'portraits' => {
  if (category === 'landscapes' || category === 'portraits') {
    return category;
  }

  return 'heritage';
};

const buildProductGallery = (product: ApiProduct) => {
  const sortedGallery = getSortedProductGallery(product);

  if (sortedGallery.length > 0) {
    return sortedGallery;
  }

  return product.imageUrl ? [product.imageUrl] : [];
};

const mapApiProductToDetails = (product: ApiProduct): DetailsProduct => {
  const gallery = buildProductGallery(product);
  const mainImage = gallery[0] || product.imageUrl;

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.shortDescription || product.description,
    image: mainImage,
    gallery: gallery.length > 0 ? gallery : [mainImage],
    edition: '100 Prints Only',
    size: product.sku || product.category?.name || 'Fine Art Print',
    stock: product.stock,
    basePriceUsd: product.price,
    category: normalizeCategory(product.category?.slug),
    story:
      product.description ||
      'A premium artwork curated for refined interiors, collector walls and timeless luxury spaces.',
    details: [
      { label: 'Artwork Type', value: 'Premium Fine Art Print' },
      { label: 'Edition', value: 'Limited Edition' },
      { label: 'SKU', value: product.sku || 'Artskart Collectible' },
      { label: 'Collection', value: product.category?.name || 'Artskart' },
    ],
    materials: [
      'Museum-grade fine art paper',
      'Archival quality pigment print',
      'Premium protective packaging',
      'Certificate-ready collectible artwork',
    ],
  };
};

function ProductDetailsPage() {
  const { slug } = useParams();

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState<DetailsProduct>(fallbackProduct);
  const [relatedProducts, setRelatedProducts] = useState<DetailsProduct[]>([]);
  const [activeImage, setActiveImage] = useState(fallbackProduct.gallery[0]);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<AccordionKey>(null);

  const { currency, loading, price } = useLiveCurrency();

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;

      try {
        const data = await getProductBySlug(slug);
        const mappedProduct = mapApiProductToDetails(data);

        setProduct(mappedProduct);
        setActiveImage(mappedProduct.gallery[0]);
        setQuantity(1);

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
  const repeatedReviews = [...reviews, ...reviews];
  const activeWishlist = isWishlisted(product.id);

  const toggleSection = (section: Exclude<AccordionKey, null>) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <main className={styles.productPage}>
      <section className={styles.productHero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.gallery}>
            <div className={styles.thumbs}>
              {product.gallery.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  className={activeImage === image ? styles.activeThumb : ''}
                  onClick={() => setActiveImage(image)}
                >
                  <img src={image} alt={product.title} />
                </button>
              ))}
            </div>

            <div className={styles.mainImage}>
              <span className={styles.limitedBadge}>
                Limited Edition
                <strong>{product.edition}</strong>
              </span>

              <button
                type="button"
                className={styles.wishlistBtn}
                onClick={() => toggleWishlist(product)}
              >
                <FiHeart />
              </button>

              <img src={activeImage} alt={product.title} />

              <div className={styles.dots}>
                {product.gallery.map((image, index) => (
                  <button
                    key={`${image}-dot-${index}`}
                    type="button"
                    className={activeImage === image ? styles.activeDot : ''}
                    onClick={() => setActiveImage(image)}
                    aria-label="Change artwork image"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.productInfo}>
            <span className={styles.topBadge}>✦ Limited Edition</span>

            <h1>{product.title}</h1>

            <div className={styles.ratingRow}>
              <span>★★★★★</span>
              <strong>4.9</strong>
              <small>(128 reviews)</small>
              <i />
              <small>Verified Collectors</small>
            </div>

            <p className={styles.shortDesc}>{product.description}</p>

            <div className={styles.miniFeatures}>
              <div>
                <FiAward />
                <strong>Museum Quality</strong>
                <span>Giclée Print</span>
              </div>

              <div>
                <FiShield />
                <strong>{product.edition}</strong>
                <span>Limited Edition</span>
              </div>

              <div>
                <FiBox />
                <strong>Secure Packaging</strong>
                <span>Worldwide Delivery</span>
              </div>
            </div>

            <div className={styles.stockNotice}>
              <FiShield />
              <div>
                <strong>Only {product.stock} prints left in this batch</strong>
                <span>Secure yours before it’s gone.</span>
              </div>
            </div>

            <div className={styles.priceBlock}>
              <span>USD ${product.basePriceUsd}.00</span>
              <strong>≈ {localPrice}</strong>
              <small>
                Live price in {currency}. Prices updated using real-time
                currency conversion.
              </small>
            </div>

            <div className={styles.quantityLine}>
              <span>Quantity</span>

              <div className={styles.quantityBox}>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  <FiMinus />
                </button>

                <strong>{quantity}</strong>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) => Math.min(product.stock, prev + 1))
                  }
                >
                  <FiPlus />
                </button>
              </div>

              <p>Only {product.stock} prints left</p>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.addCart}
                onClick={handleAddToCart}
              >
                <FiShoppingBag /> Add to Cart
              </button>

              <button
                type="button"
                className={styles.likeBtn}
                onClick={() => toggleWishlist(product)}
                aria-label={
                  activeWishlist ? 'Remove from wishlist' : 'Add to wishlist'
                }
              >
                <FiHeart />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={`container ${styles.serviceStrip}`}>
        <div>
          <FiTruck />
          <strong>Free shipping</strong>
          <span>
            Prices are listed at base value. No GST is applied on exports.
            Customs duties may apply depending on destination.
          </span>
        </div>

        <div>
          <FiFeather />
          <strong>Eco-conscious materials</strong>
          <span>
            Responsibly sourced, premium materials for lasting beauty.
          </span>
        </div>

        <div>
          <FiShield />
          <strong>Protective packaging</strong>
          <span>Each artwork is securely packed with care and precision.</span>
        </div>
      </section>

      <section className={`container ${styles.infoBlock}`}>
        <div className={styles.accordionColumn}>
          <div className={styles.accordionItem}>
            <button type="button" onClick={() => toggleSection('story')}>
              <span>Story</span>
              <FiChevronDown />
            </button>

            {openSection === 'story' && (
              <div className={styles.accordionContent}>
                <p>{product.story}</p>
              </div>
            )}
          </div>

          <div className={styles.accordionItem}>
            <button type="button" onClick={() => toggleSection('details')}>
              <span>Details</span>
              <FiChevronDown />
            </button>

            {openSection === 'details' && (
              <div className={styles.accordionContent}>
                <dl>
                  {product.details.map((detail) => (
                    <div key={detail.label}>
                      <dt>{detail.label}</dt>
                      <dd>{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <div className={styles.accordionItem}>
            <button type="button" onClick={() => toggleSection('materials')}>
              <span>Craft & Materials</span>
              <FiChevronDown />
            </button>

            {openSection === 'materials' && (
              <div className={styles.accordionContent}>
                <ul>
                  {product.materials.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <article className={styles.careCard}>
          <FiFeather />
          <h3>Care Guidance</h3>

          <ul>
            <li>Keep away from direct sunlight</li>
            <li>Frame under glass for archival protection</li>
            <li>Handle with clean, dry hands</li>
            <li>Store flat in sleeve when not framed</li>
          </ul>
        </article>

        <article className={styles.frameCard}>
          <FiBox />
          <h3>Framing Support</h3>

          <p>
            Framing advice and curated frame suggestions will be shared after
            purchase based on your region.
          </p>
        </article>
      </section>

      <section className={`container ${styles.authCard}`}>
        <FiAward />

        <div>
          <h3>Certificate of Authenticity</h3>

          <ul>
            <li>Hand-signed Certificate</li>
            <li>Signed limited edition</li>
            <li>Artskart authenticity seal</li>
          </ul>
        </div>
      </section>

      <section className={`container ${styles.bottomGrid}`}>
        <div className={styles.reviewsPanel}>
          <div className={styles.panelHead}>
            <h2>What Collectors Are Saying</h2>
            <Link to="/reviews">View All Reviews →</Link>
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
              <FiStar />
              <strong>128+</strong>
              <span>Verified Reviews</span>
            </div>

            <div>
              <FiStar />
              <strong>4.9</strong>
              <span>Average Rating</span>
            </div>

            <div>
              <FiAward />
              <strong>100</strong>
              <span>Limited Edition</span>
            </div>

            <div>
              <FiShield />
              <strong>Zero</strong>
              <span>Mass Reprints</span>
            </div>
          </div>
        </div>

        <div className={styles.relatedPanel}>
          <div className={styles.panelHead}>
            <h2>You May Also Love</h2>
            <Link to="/shop">View All →</Link>
          </div>

          <div className={styles.relatedGrid}>
            {relatedProducts.map((item) => (
              <Link
                to={`/product/${item.slug}`}
                className={styles.relatedCard}
                key={item.id}
              >
                <div>
                  <img src={item.image} alt={item.title} />
                  <span>
                    <FiHeart />
                  </span>
                </div>

                <h3>{item.title}</h3>
                <p>Limited Edition</p>
                <strong>${item.basePriceUsd}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetailsPage;
