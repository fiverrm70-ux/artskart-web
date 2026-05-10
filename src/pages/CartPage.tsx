import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiLock,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiTag,
  FiTrash2,
  FiTruck,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useLiveCurrency } from '../utils/useLiveCurrency';
import styles from './CartPage.module.css';

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function CartPage() {
  const { items, updateQuantity, removeFromCart, addToCart } = useCart();
  const { currency, rate } = useLiveCurrency();

  const subtotalUsd = items.reduce(
    (total, item) => total + item.product.basePriceUsd * item.quantity,
    0,
  );

  const totalLocal = subtotalUsd * rate;
  const recommendedProducts = products
    .filter((product) => !items.some((item) => item.product.id === product.id))
    .slice(0, 4);

  if (items.length === 0) {
    return (
      <main className={styles.cartPage}>
        <section className={styles.emptyState}>
          <span>Your Cart</span>
          <h1>Your cart is empty</h1>
          <p>Explore curated collections and add your favourite artwork.</p>
          <Link to="/shop">Shop Artworks</Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.cartPage}>
      <section className={styles.cartIntro}>
        <span>Your Cart</span>
        <h1>Your Cart</h1>
        <p>Review your selected artworks and proceed to secure checkout.</p>
      </section>

      <section className={styles.cartWrap}>
        <div className={styles.leftPanel}>
          <div className={styles.benefitsStrip}>
            <div>
              <FiTruck />
              <strong>Free Shipping</strong>
              <span>On selected orders</span>
            </div>

            <div>
              <FiShield />
              <strong>Secure Packaging</strong>
              <span>Premium safe delivery</span>
            </div>

            <div>
              <FiRefreshCw />
              <strong>Easy Returns</strong>
              <span>Hassle-free return policy</span>
            </div>

            <div>
              <FiAward />
              <strong>24/7 Support</strong>
              <span>We’re here to help you</span>
            </div>
          </div>

          <div className={styles.cartTable}>
            <div className={styles.tableHead}>
              <span>Artwork</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span />
            </div>

            <AnimatePresence>
              {items.map((item) => {
                const unitLocalPrice = item.product.basePriceUsd * rate;
                const lineTotalLocal = unitLocalPrice * item.quantity;

                return (
                  <motion.article
                    className={styles.cartItem}
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={styles.artworkCell}>
                      <Link
                        to={`/product/${item.product.slug}`}
                        className={styles.imageBox}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                        />
                        <span>{item.product.edition}</span>
                      </Link>

                      <div className={styles.itemInfo}>
                        <h3>{item.product.title}</h3>
                        <p>Limited Edition Fine Art Print</p>
                        <small>Only {item.product.stock} left</small>
                      </div>
                    </div>

                    <div className={styles.priceCell}>
                      <strong>{formatMoney(unitLocalPrice, currency)}</strong>
                      <span>${item.product.basePriceUsd.toFixed(2)} USD</span>
                    </div>

                    <div className={styles.quantityBox}>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </button>

                      <b>{item.quantity}</b>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <div className={styles.totalCell}>
                      <strong>{formatMoney(lineTotalLocal, currency)}</strong>
                    </div>

                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(item.product.id)}
                      aria-label="Remove item"
                    >
                      <FiTrash2 />
                    </button>
                  </motion.article>
                );
              })}
            </AnimatePresence>

            <div className={styles.protectionNote}>
              <FiShield />
              <p>
                <strong>Protection Plan:</strong> all artworks are carefully
                packed with premium materials to ensure safe delivery.
              </p>
            </div>
          </div>

          {recommendedProducts.length > 0 && (
            <section className={styles.recommendations}>
              <div className={styles.sectionTitle}>
                <div>
                  <h2>You May Also Like</h2>
                  <span />
                </div>

                <Link to="/shop">
                  View All <FiArrowRight />
                </Link>
              </div>

              <div className={styles.recommendGrid}>
                {recommendedProducts.map((product) => {
                  const localPrice = product.basePriceUsd * rate;

                  return (
                    <article className={styles.recommendCard} key={product.id}>
                      <Link
                        to={`/product/${product.slug}`}
                        className={styles.recommendImage}
                      >
                        <img src={product.image} alt={product.title} />
                        <small>In Stock</small>
                      </Link>

                      <button
                        className={styles.recommendHeart}
                        type="button"
                        aria-label="Add to wishlist"
                      >
                        <FiHeart />
                      </button>

                      <div className={styles.recommendBody}>
                        <h3>{product.title}</h3>
                        <p>Premium Fine Art Print</p>
                        <span>{formatMoney(localPrice, currency)}</span>

                        <button
                          type="button"
                          onClick={() => addToCart(product, 1)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className={styles.carouselButtons}>
                <button type="button" aria-label="Previous">
                  <FiChevronLeft />
                </button>
                <button type="button" aria-label="Next">
                  <FiChevronRight />
                </button>
              </div>
            </section>
          )}

          <div className={styles.bottomTrust}>
            <div>
              <FiCheckCircle />
              <strong>Artwork with Passion</strong>
              <span>Curated with care and authenticity</span>
            </div>

            <div>
              <FiHeart />
              <strong>Trusted by Collectors</strong>
              <span>Premium collector-first experience</span>
            </div>

            <div>
              <FiTruck />
              <strong>Worldwide Delivery</strong>
              <span>Reliable shipping support</span>
            </div>

            <div>
              <FiLock />
              <strong>Safe Payments</strong>
              <span>Secure payment gateway ready</span>
            </div>
          </div>
        </div>

        <aside className={styles.summary}>
          <div className={styles.summaryHeader}>
            <FiShoppingBagIcon />
            <div>
              <h2>Order Summary</h2>
              <span>{items.length} Items</span>
            </div>
          </div>

          <div className={styles.summaryRows}>
            <div>
              <span>Subtotal</span>
              <strong>{formatMoney(totalLocal, currency)}</strong>
            </div>

            <div>
              <span>Shipping</span>
              <b>FREE</b>
            </div>

            <div>
              <span>Packaging & Handling</span>
              <b>FREE</b>
            </div>
          </div>

          <div className={styles.totalBox}>
            <span>Total</span>
            <strong>{formatMoney(totalLocal, currency)}</strong>
            <small>${subtotalUsd.toFixed(2)} USD</small>
          </div>

          <div className={styles.secureBox}>
            <FiShield />
            <div>
              <strong>Secure Checkout</strong>
              <span>Your information is protected.</span>
            </div>
          </div>

          <div className={styles.couponBox}>
            <FiTag />
            <input placeholder="Enter coupon code" />
            <button type="button">Apply</button>
          </div>

          <Link to="/checkout" className={styles.checkoutBtn}>
            <FiLock />
            Proceed to Checkout
          </Link>

          <p className={styles.checkoutNote}>
            You will be redirected to secure checkout.
          </p>

          <div className={styles.acceptBox}>
            <span>We Accept</span>
            <div>
              <strong>Razorpay</strong>
              <strong>PayPal</strong>
            </div>
          </div>

          <div className={styles.helpBox}>
            <h3>Need Help?</h3>
            <p>support@artskart.com</p>
            <p>+91 12345 67890</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function FiShoppingBagIcon() {
  return <FiShoppingBag />;
}

export default CartPage;
