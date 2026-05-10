import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import toast from 'react-hot-toast';
import {
  FiCheckCircle,
  FiCreditCard,
  FiGlobe,
  FiLoader,
  FiLock,
  FiMapPin,
  FiShoppingBag,
  FiUser,
} from 'react-icons/fi';

import { useCart } from '../context/CartContext';
import { useLiveCurrency } from '../utils/useLiveCurrency';
import {
  createOrder,
  verifyRazorpayPayment,
  type ApiOrder,
  type RazorpayOrderResponse,
} from '../lib/ordersApi';
import { getMyAddresses, type ApiAddress } from '../lib/addressApi';
import styles from './CheckoutPage.module.css';

type PaymentMethod = 'razorpay' | 'paypal';

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount?: number;
  currency?: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { currency, rate } = useLiveCurrency();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId,
  );

  useEffect(() => {
    const loadAddresses = async () => {
      const token = localStorage.getItem('artskart_token');

      if (!token) return;

      try {
        const data = await getMyAddresses();
        setAddresses(data);

        const defaultAddress =
          data.find((address) => address.isDefault) || data[0];

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setPhone(defaultAddress.phone);
        }
      } catch (error) {
        console.error('Failed to load checkout addresses:', error);
      }
    };

    loadAddresses();
  }, []);

  const subtotalUsd = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.product.basePriceUsd * item.quantity,
        0,
      ),
    [items],
  );

  const totalLocal = subtotalUsd * rate;

  const openRazorpayCheckout = async (order: RazorpayOrderResponse) => {
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded || !window.Razorpay) {
      toast.error('Could not load Razorpay. Please try again.');
      setIsProcessing(false);
      return;
    }

    if (!order.razorpayKey || !order.razorpayOrderId) {
      toast.error('Razorpay order details missing');
      setIsProcessing(false);
      return;
    }

    const razorpay = new window.Razorpay({
      key: order.razorpayKey,
      order_id: order.razorpayOrderId,
      name: 'Artskart',
      description: `Order ${order.orderNumber}`,
      prefill: {
        name: selectedAddress?.fullName || order.customerName || '',
        email: selectedAddress?.email || order.customerEmail || '',
        contact: selectedAddress?.phone || order.customerPhone || phone,
      },
      theme: {
        color: '#A77833',
      },
      handler: async (response) => {
        try {
          toast.loading('Verifying payment...', {
            id: 'payment-verification',
          });

          const verifiedOrder: ApiOrder = await verifyRazorpayPayment({
            orderId: order.id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          await clearCart();

          toast.success('Payment verified successfully', {
            id: 'payment-verification',
          });

          navigate('/order-success', {
            state: {
              order: verifiedOrder,
            },
          });
        } catch (error) {
          console.error('Payment verification failed:', error);

          toast.error(
            'Payment received but verification failed. Please contact support.',
            {
              id: 'payment-verification',
            },
          );

          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: () => {
          toast.error('Payment cancelled');
          setIsProcessing(false);
        },
      },
    });

    razorpay.open();
  };

  const handlePayNow = async () => {
    if (isProcessing) return;

    const token = localStorage.getItem('artskart_token');

    if (!token) {
      toast.error('Please login before checkout');
      navigate('/account');
      return;
    }

    if (!selectedAddressId) {
      toast.error('Please add/select shipping address from Account page');
      navigate('/account');
      return;
    }

    if (paymentMethod === 'paypal') {
      toast.error('PayPal will be enabled later');
      return;
    }

    try {
      setIsProcessing(true);

      const order = await createOrder(selectedAddressId);

      await openRazorpayCheckout(order);
    } catch (error) {
      console.error('Failed to start Razorpay payment:', error);
      toast.error('Could not start payment');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className={styles.checkoutPage}>
        <section className={styles.emptyState}>
          <h1>Your checkout is empty</h1>
          <p>Add artworks to your cart before proceeding to checkout.</p>
          <Link to="/shop">Shop Artworks</Link>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.checkoutPage}>
      <section className={styles.headerBlock}>
        <span>Secure Checkout</span>
        <h1>Checkout</h1>
        <p>Complete your details and choose Razorpay.</p>
      </section>

      <section className={styles.checkoutWrap}>
        <div className={styles.leftPanel}>
          <div className={styles.stepBar}>
            <div className={styles.activeStep}>1</div>
            <span />
            <div>2</div>
            <span />
            <div>3</div>
          </div>

          <div className={styles.formCard}>
            <div className={styles.cardHeading}>
              <FiUser />
              <div>
                <h2>Customer Details</h2>
                <p>Using your saved account and address details.</p>
              </div>
            </div>

            <div className={styles.formGrid}>
              <label>
                Full Name *
                <input
                  placeholder="Enter your full name"
                  value={selectedAddress?.fullName || ''}
                  readOnly
                />
              </label>

              <label>
                Email Address *
                <input
                  placeholder="Enter your email address"
                  value={selectedAddress?.email || ''}
                  readOnly
                />
              </label>

              <label className={styles.full}>
                Phone Number *
                <div className={styles.phoneField}>
                  <PhoneInput
                    defaultCountry="in"
                    value={phone}
                    onChange={setPhone}
                    placeholder="Enter your phone number"
                    disabled
                  />
                </div>
              </label>
            </div>
          </div>

          <div className={styles.formCard}>
            <div className={styles.cardHeading}>
              <FiMapPin />
              <div>
                <h2>Shipping Address</h2>
                <p>Select your saved delivery address.</p>
              </div>
            </div>

            {addresses.length > 0 ? (
              <div className={styles.formGrid}>
                <label className={styles.full}>
                  Saved Address *
                  <select
                    value={selectedAddressId}
                    onChange={(event) => {
                      const addressId = event.target.value;
                      const address = addresses.find(
                        (item) => item.id === addressId,
                      );

                      setSelectedAddressId(addressId);

                      if (address) {
                        setPhone(address.phone);
                      }
                    }}
                  >
                    {addresses.map((address) => (
                      <option value={address.id} key={address.id}>
                        {address.fullName} — {address.city}, {address.state}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.full}>
                  Address Line 1 *
                  <input
                    placeholder="House no., building, street"
                    value={selectedAddress?.addressLine1 || ''}
                    readOnly
                  />
                </label>

                <label className={styles.full}>
                  Address Line 2
                  <input
                    placeholder="Apartment, landmark, area"
                    value={selectedAddress?.addressLine2 || ''}
                    readOnly
                  />
                </label>

                <label>
                  City *
                  <input
                    placeholder="Enter city"
                    value={selectedAddress?.city || ''}
                    readOnly
                  />
                </label>

                <label>
                  State / Region *
                  <input
                    placeholder="Enter state or region"
                    value={selectedAddress?.state || ''}
                    readOnly
                  />
                </label>

                <label>
                  Pincode / ZIP *
                  <input
                    placeholder="Enter postal code"
                    value={selectedAddress?.postalCode || ''}
                    readOnly
                  />
                </label>

                <label>
                  Country *
                  <input
                    placeholder="Enter country"
                    value={selectedAddress?.country || ''}
                    readOnly
                  />
                </label>
              </div>
            ) : (
              <div className={styles.formGrid}>
                <label className={styles.full}>
                  No saved address found
                  <input
                    value="Please add an address from Account page before checkout."
                    readOnly
                  />
                </label>
              </div>
            )}
          </div>

          <div className={styles.formCard}>
            <div className={styles.cardHeading}>
              <FiCreditCard />
              <div>
                <h2>Payment Method</h2>
                <p>Razorpay is active. PayPal will be enabled later.</p>
              </div>
            </div>

            <div className={styles.paymentOptions}>
              <button
                type="button"
                className={
                  paymentMethod === 'razorpay' ? styles.selectedPayment : ''
                }
                onClick={() => setPaymentMethod('razorpay')}
              >
                <FiLock />
                <div>
                  <strong>Razorpay</strong>
                  <span>UPI, cards, netbanking and wallets</span>
                </div>
                <b>Recommended</b>
              </button>

              <button
                type="button"
                className={
                  paymentMethod === 'paypal' ? styles.selectedPayment : ''
                }
                onClick={() => setPaymentMethod('paypal')}
              >
                <FiGlobe />
                <div>
                  <strong>PayPal</strong>
                  <span>International collector payments</span>
                </div>
                <b>Coming Soon</b>
              </button>
            </div>
          </div>
        </div>

        <aside className={styles.summary}>
          <div className={styles.summaryHeader}>
            <div>
              <FiShoppingBag />
              <h2>Order Summary</h2>
            </div>
            <span>{items.length} Items</span>
          </div>

          <div className={styles.summaryItems}>
            {items.map((item) => (
              <div className={styles.summaryItem} key={item.product.id}>
                <img src={item.product.image} alt={item.product.title} />

                <div>
                  <h3>{item.product.title}</h3>
                  <p>Qty: {item.quantity}</p>
                  <span>${item.product.basePriceUsd.toFixed(2)} USD</span>
                </div>

                <strong>
                  {formatMoney(
                    item.product.basePriceUsd * item.quantity * rate,
                    currency,
                  )}
                </strong>
              </div>
            ))}
          </div>

          <div className={styles.couponBox}>
            <input placeholder="Enter coupon code" />
            <button type="button">Apply</button>
          </div>

          <div className={styles.totalRows}>
            <div>
              <span>Subtotal</span>
              <strong>{formatMoney(totalLocal, currency)}</strong>
            </div>

            <div>
              <span>Shipping</span>
              <strong>FREE</strong>
            </div>

            <div>
              <span>Packaging</span>
              <strong>FREE</strong>
            </div>
          </div>

          <div className={styles.totalBox}>
            <span>Total</span>
            <strong>{formatMoney(totalLocal, currency)}</strong>
            <small>${subtotalUsd.toFixed(2)} USD</small>
          </div>

          <button
            type="button"
            className={styles.payButton}
            onClick={handlePayNow}
            disabled={isProcessing}
          >
            {isProcessing ? <FiLoader /> : <FiLock />}
            {isProcessing
              ? 'Opening secure payment...'
              : paymentMethod === 'razorpay'
                ? 'Pay Securely with Razorpay'
                : 'PayPal Coming Soon'}
          </button>

          <div className={styles.secureNote}>
            <FiCheckCircle />
            <p>
              Razorpay secure checkout is active. Payment verification is now
              connected with backend signature validation.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default CheckoutPage;
