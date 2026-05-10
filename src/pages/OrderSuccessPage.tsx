import { Link, useLocation } from 'react-router-dom';
import {
  FiCheck,
  FiDownload,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPackage,
  FiShoppingBag,
  FiTruck,
} from 'react-icons/fi';
import Confetti from 'react-confetti';

import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useLiveCurrency } from '../utils/useLiveCurrency';
import type { ApiOrder } from '../lib/ordersApi';
import styles from './OrderSuccessPage.module.css';

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function OrderSuccessPage() {
  const location = useLocation();
  const { addToCart } = useCart();
  const { currency, rate } = useLiveCurrency();

  const order = location.state?.order as ApiOrder | undefined;

  const orderItems =
    order?.items.map((item) => ({
      id: item.id,
      title: item.productTitle,
      image: item.productImage,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    })) ?? [];

  const fallbackItems = products.slice(0, 2).map((product) => ({
    id: product.id,
    title: product.title,
    image: product.image,
    quantity: 1,
    unitPrice: product.basePriceUsd,
    totalPrice: product.basePriceUsd,
  }));

  const displayItems = orderItems.length > 0 ? orderItems : fallbackItems;

  const subtotalUsd =
    order?.subtotal ??
    displayItems.reduce((total, item) => total + item.totalPrice, 0);

  const totalUsd = order?.totalAmount ?? subtotalUsd;
  const totalLocal = totalUsd * rate;
  const recommendedProducts = products.slice(0, 4);

  return (
    <main className={styles.successPage}>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={180}
        recycle={false}
      />

      <section className={styles.hero}>
        <div className={styles.successPanel}>
          <div className={styles.checkIcon}>
            <FiCheck />
          </div>

          <span>Order Confirmed</span>
          <h1>Thank You!</h1>
          <h2>Your Order has been Placed Successfully</h2>

          <p>
            We’ve received your order and it is now being processed. You will
            receive an email confirmation shortly.
          </p>

          <div className={styles.orderMeta}>
            <div>
              <FiPackage />
              <small>Order ID</small>
              <strong>{order?.orderNumber || 'ARTSKART-78254'}</strong>
            </div>

            <div>
              <FiTruck />
              <small>Delivery</small>
              <strong>5–7 Business Days</strong>
            </div>

            <div>
              <FiCheck />
              <small>Payment</small>
              <strong>{order?.paymentStatus || 'Payment Pending'}</strong>
            </div>
          </div>

          <div className={styles.heroActions}>
            <Link to="/shop">
              <FiShoppingBag />
              Continue Shopping
            </Link>

            <button type="button">
              <FiDownload />
              Download Invoice
            </button>
          </div>

          <p className={styles.whatsappLine}>
            <FiMessageCircle />
            Need help? Chat with us on <strong>WhatsApp</strong>
          </p>
        </div>

        <div className={styles.artPreview}>
          <img src={displayItems[0]?.image} alt={displayItems[0]?.title} />
        </div>
      </section>

      <section className={styles.detailsCard}>
        <div className={styles.orderList}>
          <h2>Order Summary</h2>

          <div className={styles.itemsList}>
            {displayItems.map((item) => (
              <div className={styles.orderItem} key={item.id}>
                <img src={item.image} alt={item.title} />

                <div>
                  <h3>{item.title}</h3>
                  <p>Premium Fine Art Print</p>
                  <span>Qty: {item.quantity}</span>
                </div>

                <strong>{formatMoney(item.totalPrice * rate, currency)}</strong>
              </div>
            ))}
          </div>

          <div className={styles.protectionNote}>
            All artworks are carefully packed with premium materials to ensure
            safe delivery.
          </div>
        </div>

        <aside className={styles.shippingBox}>
          <div className={styles.addressBox}>
            <FiMapPin />
            <div>
              <h2>Shipping Address</h2>
              <p>
                {order?.shippingAddress ||
                  'Customer shipping details will appear here after backend order creation.'}
              </p>
            </div>
          </div>

          <div className={styles.totalRows}>
            <div>
              <span>Subtotal</span>
              <strong>{formatMoney(subtotalUsd * rate, currency)}</strong>
            </div>

            <div>
              <span>Shipping</span>
              <b>FREE</b>
            </div>

            <div>
              <span>Packaging</span>
              <b>FREE</b>
            </div>
          </div>

          <div className={styles.totalBox}>
            <span>Total</span>
            <strong>{formatMoney(totalLocal, currency)}</strong>
            <small>${totalUsd.toFixed(2)} USD</small>
          </div>
        </aside>
      </section>

      <section className={styles.recommendations}>
        <div className={styles.sectionTitle}>
          <div>
            <h2>You May Also Like</h2>
            <span />
          </div>

          <Link to="/shop">View All Artworks →</Link>
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

                <div className={styles.recommendBody}>
                  <h3>{product.title}</h3>
                  <p>Premium Fine Art Print</p>
                  <strong>{formatMoney(localPrice, currency)}</strong>

                  <button type="button" onClick={() => addToCart(product, 1)}>
                    Add to Cart
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.supportStrip}>
        <div>
          <FiMessageCircle />
          <h3>Need Help?</h3>
          <p>Chat with our art concierge on WhatsApp.</p>
          <button type="button">Chat on WhatsApp</button>
        </div>

        <div>
          <FiMail />
          <h3>Email Us</h3>
          <p>support@artskart.com</p>
          <span>We usually reply within a few minutes.</span>
        </div>

        <div>
          <FiTruck />
          <h3>Estimated Delivery</h3>
          <p>Your order will be delivered within 5–7 business days.</p>
          <span>You will receive tracking details via email.</span>
        </div>
      </section>
    </main>
  );
}

export default OrderSuccessPage;
