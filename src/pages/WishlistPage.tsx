import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLiveCurrency } from '../utils/useLiveCurrency';
import styles from './WishlistPage.module.css';

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { currency, rate } = useLiveCurrency();

  if (wishlistItems.length === 0) {
    return (
      <main className={styles.wishlistPage}>
        <section className={styles.emptyState}>
          <FiHeart />
          <span>Your Collection</span>
          <h1>Your wishlist is empty</h1>
          <p>
            Save artworks you love and revisit them anytime before adding them
            to your cart.
          </p>
          <Link to="/shop">Explore Artworks</Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.wishlistPage}>
      <section className={styles.hero}>
        <span>Saved Artworks</span>
        <h1>Your Wishlist</h1>
        <p>
          A curated collection of artworks you have saved for later viewing.
        </p>
      </section>

      <section className={`container ${styles.grid}`}>
        {wishlistItems.map((product) => (
          <article className={styles.card} key={product.id}>
            <Link to={`/product/${product.slug}`} className={styles.imageWrap}>
              <img src={product.image} alt={product.title} />
              <span>{product.edition}</span>
            </Link>

            <div className={styles.cardBody}>
              <p>{product.category}</p>
              <h2>{product.title}</h2>
              <small>{product.description}</small>

              <div className={styles.priceRow}>
                <strong>
                  {formatMoney(product.basePriceUsd * rate, currency)}
                </strong>
                <span>${product.basePriceUsd.toFixed(2)} USD</span>
              </div>

              <div className={styles.stockRow}>
                <span>{product.stockLeft} left</span>
              </div>

              <div className={styles.actions}>
                <button type="button" onClick={() => addToCart(product)}>
                  <FiShoppingBag />
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  aria-label="Remove from wishlist"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default WishlistPage;
