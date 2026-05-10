import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FiArrowRight,
  FiGlobe,
  FiImage,
  FiMap,
  FiPlay,
  FiUser,
  FiX,
} from 'react-icons/fi';

import styles from './HomePage.module.css';

import hero1 from '../assets/home/hero/hero-1.webp';
import hero2 from '../assets/home/hero/hero-2.webp';
import hero3 from '../assets/home/hero/hero-3.webp';

import heritageImage from '../assets/home/collections/heritage.webp';
import landscapesImage from '../assets/home/collections/landscapes.webp';
import portraitsImage from '../assets/home/collections/portraits.webp';

import { products as fallbackProducts } from '../data/products';
import { getFeaturedProducts, type ApiProduct } from '../lib/productsApi';
import { useLiveCurrency } from '../utils/useLiveCurrency';

const heroImages = [hero1, hero2, hero3];

const collections = [
  {
    title: 'Heritage',
    image: heritageImage,
    link: '/shop/heritage',
    icon: FiImage,
    description:
      'Timeless echoes of history and architecture, captured in exquisite detail.',
  },
  {
    title: 'Landscapes',
    image: landscapesImage,
    link: '/shop/landscapes',
    icon: FiMap,
    description:
      'Breathtaking views and serene natural beauty, perfect for inspiring spaces.',
  },
  {
    title: 'Portraits',
    image: portraitsImage,
    link: '/shop/portraits',
    icon: FiUser,
    description:
      'Expressive faces and timeless stories, captured with emotion and depth.',
  },
];

type Review = {
  id: string;
  name: string;
  country: string;
  flag: string;
  product: string;
  mediaType: 'photo' | 'video';
  image: string;
  shortReview: string;
  fullReview: string;
  purchasedOn: string;
  size: string;
};

type FeaturedArtwork = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  edition: string;
  size: string;
  stock: number;
  basePriceUsd: number;
};

const reviews: Review[] = [
  {
    id: 'review-1',
    name: 'Arjun Mehta',
    country: 'Mumbai, India',
    flag: '🇮🇳',
    product: 'Vishnu and Lakshmi',
    mediaType: 'photo',
    image:
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80',
    shortReview:
      'Exceptional detail and color. It completely elevated our living room.',
    fullReview:
      'A divine masterpiece that transformed our pooja room. The details, colors and texture are simply outstanding. Packaging was premium and delivery was safe.',
    purchasedOn: '12 Apr, 2024',
    size: '24 × 36 inches',
  },
  {
    id: 'review-2',
    name: 'Fatima Al Mansoori',
    country: 'Dubai, UAE',
    flag: '🇦🇪',
    product: 'Royal Heritage',
    mediaType: 'video',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
    shortReview:
      'The video does not do justice to the real artwork. Simply breathtaking.',
    fullReview:
      'The artwork looks far more premium in person. It became the center of our majlis wall and every guest notices it immediately.',
    purchasedOn: '26 May, 2024',
    size: '30 × 40 inches',
  },
  {
    id: 'review-3',
    name: 'James Whitaker',
    country: 'London, UK',
    flag: '🇬🇧',
    product: 'Golden Valley Landscape',
    mediaType: 'photo',
    image:
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80',
    shortReview: 'Museum quality at its best. Perfect for our master bedroom.',
    fullReview:
      'The print quality, framing suggestion and overall finish felt very premium. It added warmth and elegance to our bedroom.',
    purchasedOn: '08 Jun, 2024',
    size: '20 × 30 inches',
  },
  {
    id: 'review-4',
    name: 'Sophie Laurent',
    country: 'Paris, France',
    flag: '🇫🇷',
    product: 'Timeless Elegance',
    mediaType: 'video',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80',
    shortReview: 'Our guests cannot stop admiring this masterpiece.',
    fullReview:
      'The artwork has a quiet luxury feel. The colors are rich, elegant and perfect for our formal lounge.',
    purchasedOn: '19 Jul, 2024',
    size: '18 × 24 inches',
  },
  {
    id: 'review-5',
    name: 'Michael Tan',
    country: 'Singapore',
    flag: '🇸🇬',
    product: 'Royal Portrait Study',
    mediaType: 'photo',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    shortReview: 'A timeless piece that adds soul to our space.',
    fullReview:
      'The portrait has depth and presence. It gave our hallway a gallery-like premium look.',
    purchasedOn: '04 Aug, 2024',
    size: '18 × 24 inches',
  },
  {
    id: 'review-6',
    name: 'Elena Petrova',
    country: 'Sydney, Australia',
    flag: '🇦🇺',
    product: 'Divine Heritage',
    mediaType: 'video',
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
    shortReview: 'The craftsmanship is beyond expectations.',
    fullReview:
      'Beautifully packed, safely delivered and the finish looks luxurious. It feels like a collectible piece.',
    purchasedOn: '14 Sep, 2024',
    size: '24 × 36 inches',
  },
];

const mapApiProductToArtwork = (product: ApiProduct): FeaturedArtwork => ({
  id: product.id,
  title: product.title,
  slug: product.slug,
  description: product.shortDescription || product.description,
  image: product.imageUrl,
  edition: 'Limited Edition',
  size: product.sku || product.category?.name || 'Fine Art Print',
  stock: product.stock,
  basePriceUsd: product.price,
});

const fallbackFeaturedArtworks: FeaturedArtwork[] = fallbackProducts
  .slice(0, 3)
  .map((product) => ({
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    image: product.image,
    edition: product.edition,
    size: product.size || 'Fine Art Print',
    stock: product.stock,
    basePriceUsd: product.basePriceUsd,
  }));

function HomePage() {
  const [activeHero, setActiveHero] = useState(0);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [featuredArtworks, setFeaturedArtworks] = useState<FeaturedArtwork[]>(
    fallbackFeaturedArtworks,
  );

  const { currency, loading, price } = useLiveCurrency();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHero((prev) => (prev + 1) % heroImages.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadFeaturedProducts = async () => {
      try {
        const backendProducts = await getFeaturedProducts();

        if (!isMounted || backendProducts.length === 0) {
          return;
        }

        setFeaturedArtworks(
          backendProducts.slice(0, 3).map(mapApiProductToArtwork),
        );
      } catch (error) {
        console.error('Failed to load featured products:', error);
      }
    };

    loadFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const reviewRowOne = [...reviews, ...reviews];
  const reviewRowTwo = [
    ...reviews.slice().reverse(),
    ...reviews.slice().reverse(),
  ];

  return (
    <main className={styles.homePage}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className={styles.label}>
              ✦ Limited Edition Fine Art Prints
            </span>

            <h1>
              Timeless Art. <br />
              Crafted with <br />
              Intention.
            </h1>

            <p>
              Discover museum-inspired premium artworks curated for collectors,
              elegant interiors, luxury spaces and global art enthusiasts.
            </p>

            <div className={styles.actions}>
              <Link to="/shop" className="premium-btn">
                Shop Collection
              </Link>

              <Link to="/b2b" className="outline-btn">
                B2B Enquiry
              </Link>
            </div>
          </div>

          <div className={styles.heroFrame}>
            <div className={styles.badge}>✦ 100 Prints Only</div>

            <img
              src={heroImages[activeHero]}
              alt="Artskart premium artwork"
              className={styles.heroImage}
            />

            <div className={styles.heroDots}>
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={activeHero === index ? styles.activeDot : ''}
                  onClick={() => setActiveHero(index)}
                  aria-label={`Show artwork ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.collectionsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.label}>✦ Explore Collections</span>

            <h2>
              Curated Categories. <br />
              Timeless Masterpieces.
            </h2>

            <p>
              Explore our handpicked collections of museum-inspired artworks,
              crafted to elevate every space with beauty and story.
            </p>
          </div>

          <div className={styles.collectionGrid}>
            {collections.map((collection) => (
              <Link
                to={collection.link}
                className={styles.collectionCard}
                key={collection.title}
              >
                <div className={styles.collectionImage}>
                  <img src={collection.image} alt={collection.title} />

                  <span className={styles.arrowCircle}>
                    <FiArrowRight />
                  </span>
                </div>

                <div className={styles.collectionContent}>
                  <div className={styles.iconCircle}>
                    <collection.icon />
                  </div>

                  <h3>{collection.title}</h3>

                  <p>{collection.description}</p>

                  <strong>
                    Explore Collection <FiArrowRight />
                  </strong>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.collectionAction}>
            <Link to="/shop">
              View All Collections <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.featuredHeader}>
            <span className={styles.label}>✦ Curated Masterpieces</span>

            <h2>
              Featured Artworks With <br />
              Live Global Pricing.
            </h2>

            <p>
              Every artwork is priced in USD, with an approximate local currency
              conversion shown for global collectors.
            </p>

            <div className={styles.currencyNote}>
              <FiGlobe />
              <span>
                Showing local estimate in{' '}
                <strong>{loading ? 'detecting currency...' : currency}</strong>
              </span>
            </div>
          </div>

          <div className={styles.productGrid}>
            {featuredArtworks.map((product) => (
              <article className={styles.productCard} key={product.id}>
                <div className={styles.productImageWrap}>
                  <img src={product.image} alt={product.title} />

                  <div className={styles.productBadge}>{product.edition}</div>
                </div>

                <div className={styles.productInfo}>
                  <div className={styles.productMeta}>
                    <span>{product.size}</span>
                    <strong>Only {product.stock} left</strong>
                  </div>

                  <h3>{product.title}</h3>

                  <p>{product.description}</p>

                  <div className={styles.priceBox}>
                    <div>
                      <span>Base Price</span>
                      <strong>${product.basePriceUsd} USD</strong>
                    </div>

                    <div>
                      <span>Approx. Local Price</span>
                      <strong>
                        {loading
                          ? 'Calculating...'
                          : `≈ ${price(product.basePriceUsd)}`}
                      </strong>
                    </div>
                  </div>

                  <Link
                    to={`/product/${product.slug}`}
                    className={styles.productButton}
                  >
                    View Artwork <FiArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <span className={styles.label}>✦ Collector Stories</span>

          <h2>Loved By Global Art Collectors</h2>

          <p>
            See how Artskart artworks transform premium homes, hotels, offices
            and gallery walls worldwide.
          </p>
        </div>

        <div className={styles.reviewMarquee}>
          <div className={`${styles.reviewTrack} ${styles.scrollLeft}`}>
            {reviewRowOne.map((review, index) => (
              <button
                type="button"
                className={styles.reviewCard}
                key={`${review.id}-left-${index}`}
                onClick={() => setSelectedReview(review)}
              >
                <div className={styles.reviewImage}>
                  <img src={review.image} alt={review.product} />

                  <span className={styles.mediaBadge}>
                    {review.mediaType === 'video' ? (
                      <>
                        <FiPlay /> Video
                      </>
                    ) : (
                      <>
                        <FiImage /> Photo
                      </>
                    )}
                  </span>

                  {review.mediaType === 'video' && (
                    <span className={styles.playButton}>
                      <FiPlay />
                    </span>
                  )}
                </div>

                <div className={styles.reviewContent}>
                  <div className={styles.stars}>★★★★★</div>
                  <p>“{review.shortReview}”</p>

                  <div className={styles.reviewer}>
                    <strong>
                      {review.flag} {review.name}
                    </strong>
                    <span>{review.country}</span>
                  </div>

                  <span className={styles.viewReview}>View Review</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.reviewMarquee}>
          <div className={`${styles.reviewTrack} ${styles.scrollRight}`}>
            {reviewRowTwo.map((review, index) => (
              <button
                type="button"
                className={styles.reviewCard}
                key={`${review.id}-right-${index}`}
                onClick={() => setSelectedReview(review)}
              >
                <div className={styles.reviewImage}>
                  <img src={review.image} alt={review.product} />

                  <span className={styles.mediaBadge}>
                    {review.mediaType === 'video' ? (
                      <>
                        <FiPlay /> Video
                      </>
                    ) : (
                      <>
                        <FiImage /> Photo
                      </>
                    )}
                  </span>

                  {review.mediaType === 'video' && (
                    <span className={styles.playButton}>
                      <FiPlay />
                    </span>
                  )}
                </div>

                <div className={styles.reviewContent}>
                  <div className={styles.stars}>★★★★★</div>
                  <p>“{review.shortReview}”</p>

                  <div className={styles.reviewer}>
                    <strong>
                      {review.flag} {review.name}
                    </strong>
                    <span>{review.country}</span>
                  </div>

                  <span className={styles.viewReview}>View Review</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedReview && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className={styles.reviewModal}
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeModal}
              onClick={() => setSelectedReview(null)}
              aria-label="Close review"
            >
              <FiX />
            </button>

            <div className={styles.modalImage}>
              <img src={selectedReview.image} alt={selectedReview.product} />

              {selectedReview.mediaType === 'video' && (
                <span className={styles.modalPlay}>
                  <FiPlay />
                </span>
              )}
            </div>

            <div className={styles.modalContent}>
              <div className={styles.stars}>★★★★★</div>
              <span className={styles.modalProduct}>
                {selectedReview.product}
              </span>

              <h3>“{selectedReview.fullReview}”</h3>

              <div className={styles.modalBuyer}>
                <strong>
                  {selectedReview.flag} {selectedReview.name}
                </strong>
                <span>{selectedReview.country}</span>
              </div>

              <div className={styles.modalDetails}>
                <div>
                  <span>Purchased On</span>
                  <strong>{selectedReview.purchasedOn}</strong>
                </div>

                <div>
                  <span>Size</span>
                  <strong>{selectedReview.size}</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>Verified Buyer</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default HomePage;
