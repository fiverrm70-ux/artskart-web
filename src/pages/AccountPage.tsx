import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiHeart,
  FiHome,
  FiLock,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiSettings,
  FiShield,
  FiShoppingBag,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { products } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import {
  getCurrentUser,
  loginUser,
  registerUser,
  type AuthUser,
} from '../lib/authApi';
import {
  createAddress,
  getMyAddresses,
  type ApiAddress,
} from '../lib/addressApi';
import { getMyOrders, type ApiOrder } from '../lib/ordersApi';
import styles from './AccountPage.module.css';

type AuthMode = 'login' | 'register';

const fallbackProduct = products[0];

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function AccountPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });

  const { wishlistItems, wishlistCount } = useWishlist();

  const heroImage = fallbackProduct.image;
  const defaultAddress =
    addresses.find((item) => item.isDefault) || addresses[0];

  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);

  const loadAddresses = async () => {
    try {
      const data = await getMyAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const loadOrders = async () => {
    try {
      setIsOrdersLoading(true);
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Could not load orders');
    } finally {
      setIsOrdersLoading(false);
    }
  };

  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = localStorage.getItem('artskart_token');

      if (!token) return;

      try {
        const user = await getCurrentUser();
        setAuthUser(user);
        setIsLoggedIn(true);
        loadAddresses();
        loadOrders();
      } catch (error) {
        console.error('Failed to load current user:', error);
        localStorage.removeItem('artskart_token');
        localStorage.removeItem('artskart_user');
      }
    };

    loadCurrentUser();
  }, []);

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setAcceptedTerms(false);
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: '',
      phone: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('artskart_token');
    localStorage.removeItem('artskart_user');
    setAuthUser(null);
    setIsLoggedIn(false);
    setAddresses([]);
    setOrders([]);
    setSelectedOrder(null);
    resetForm();
    resetAddressForm();
    toast.success('Logged out successfully');
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        toast.error('Please enter your full name');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (!acceptedTerms) {
        toast.error('Please accept Terms & Privacy Policy');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const response =
        mode === 'login'
          ? await loginUser({
              email: email.trim(),
              password,
            })
          : await registerUser({
              name: fullName.trim(),
              email: email.trim(),
              password,
            });

      localStorage.setItem('artskart_token', response.accessToken);
      localStorage.setItem('artskart_user', JSON.stringify(response.user));

      setAuthUser(response.user);
      setIsLoggedIn(true);
      resetForm();
      loadAddresses();
      loadOrders();

      toast.success(
        mode === 'login'
          ? 'Logged in successfully'
          : 'Account created successfully',
      );
    } catch (error) {
      console.error('Authentication failed:', error);
      toast.error(
        mode === 'login'
          ? 'Invalid email or password'
          : 'Account creation failed',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressSubmit = async () => {
    if (
      !addressForm.fullName.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.addressLine1.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !addressForm.country.trim() ||
      !addressForm.postalCode.trim()
    ) {
      toast.error('Please fill all required address fields');
      return;
    }

    try {
      setIsAddressSaving(true);

      await createAddress({
        ...addressForm,
        isDefault: addresses.length === 0,
      });

      resetAddressForm();
      setShowAddressForm(false);
      await loadAddresses();

      toast.success('Address saved successfully');
    } catch (error) {
      console.error('Failed to save address:', error);
      toast.error('Could not save address');
    } finally {
      setIsAddressSaving(false);
    }
  };

  if (isLoggedIn) {
    return (
      <main className={styles.accountPage}>
        <section className={styles.dashboardShell}>
          <aside className={styles.accountSidebar}>
            <div className={styles.profileMini}>
              <div>
                {authUser?.name
                  ? authUser.name
                      .split(' ')
                      .map((item) => item[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'AK'}
              </div>
              <h2>{authUser?.name || 'Artskart Collector'}</h2>
              <p>{authUser?.email || 'Premium Member'}</p>
            </div>

            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              <FiLogOut /> Logout
            </button>
          </aside>

          <div className={styles.dashboardContent}>
            <div className={styles.welcomeCard}>
              <span>Collector Dashboard</span>
              <h1>Welcome back to your private collection.</h1>
              <p>
                Manage your saved artworks, orders and delivery preferences from
                one premium account space.
              </p>
            </div>

            <div className={styles.statsGrid}>
              <div>
                <FiShoppingBag />
                <strong>{orders.length}</strong>
                <span>Total Orders</span>
              </div>
              <div>
                <FiHeart />
                <strong>{wishlistCount}</strong>
                <span>Saved Artworks</span>
              </div>
              <div>
                <FiMapPin />
                <strong>{addresses.length}</strong>
                <span>Saved Address</span>
              </div>
            </div>

            <div className={styles.dashboardGrid}>
              <section className={styles.dashboardCard}>
                <div className={styles.sectionTitle}>
                  <h2>Recent Orders</h2>
                  <Link to="/shop">Shop More</Link>
                </div>

                <div className={styles.orderList}>
                  {isOrdersLoading && (
                    <div className={styles.addressBox}>
                      <FiPackage />
                      <div>
                        <strong>Loading orders...</strong>
                        <p>
                          Please wait while we fetch your collection orders.
                        </p>
                      </div>
                    </div>
                  )}

                  {!isOrdersLoading && recentOrders.length === 0 && (
                    <div className={styles.addressBox}>
                      <FiPackage />
                      <div>
                        <strong>No orders yet</strong>
                        <p>
                          Your purchased artworks will appear here after
                          checkout.
                        </p>
                      </div>
                    </div>
                  )}

                  {!isOrdersLoading &&
                    recentOrders.map((order) => {
                      const firstItem = order.items?.[0];
                      const isExpanded = expandedOrderId === order.id;

                      const formattedDate = new Date(
                        order.createdAt,
                      ).toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      });

                      return (
                        <div
                          className={styles.orderItem}
                          key={order.id}
                          onClick={() =>
                            setExpandedOrderId((current) =>
                              current === order.id ? null : order.id,
                            )
                          }
                        >
                          <img
                            src={
                              firstItem?.productImage || fallbackProduct.image
                            }
                            alt={firstItem?.productTitle || order.orderNumber}
                          />

                          <div className={styles.orderContent}>
                            <span>{order.orderNumber}</span>

                            <h3>
                              {firstItem?.productTitle || 'Artskart Collection'}
                            </h3>

                            <p>
                              {formatMoney(
                                Number(order.totalAmount || 0),
                                order.currency || 'USD',
                              )}
                            </p>

                            <p>
                              {order.items.length} item
                              {order.items.length > 1 ? 's' : ''} •{' '}
                              {formattedDate}
                            </p>
                          </div>

                          <div className={styles.orderActions}>
                            <strong>{order.paymentStatus}</strong>

                            <button
                              type="button"
                              className={styles.orderDetailsBtn}
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedOrder(order);
                              }}
                            >
                              View Details
                            </button>
                          </div>

                          {isExpanded && (
                            <div className={styles.compactOrderDetails}>
                              <div className={styles.compactOrderDetailsRow}>
                                <span>Order Status</span>
                                <b>{order.status}</b>
                              </div>

                              <div className={styles.compactOrderDetailsRow}>
                                <span>Payment Status</span>
                                <b>{order.paymentStatus}</b>
                              </div>

                              <div className={styles.compactOrderDetailsRow}>
                                <span>Shipping Address</span>
                                <b>{order.shippingAddress}</b>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </section>

              <section className={styles.dashboardCard}>
                <div className={styles.sectionTitle}>
                  <h2>Saved Collection</h2>
                  <Link to="/wishlist">View All</Link>
                </div>

                <div className={styles.savedPreview}>
                  {(wishlistItems.length > 0
                    ? wishlistItems
                    : products.slice(0, 1)
                  ).map((product) => (
                    <Link to={`/product/${product.slug}`} key={product.id}>
                      <img src={product.image} alt={product.title} />
                      <span>{product.title}</span>
                    </Link>
                  ))}
                </div>
              </section>

              <section className={styles.dashboardCard}>
                <div className={styles.sectionTitle}>
                  <h2>Saved Address</h2>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm((current) => !current)}
                  >
                    {showAddressForm ? 'Close' : 'Add'}
                  </button>
                </div>

                {defaultAddress && (
                  <div className={styles.addressBox}>
                    <FiMapPin />
                    <div>
                      <strong>{defaultAddress.fullName}</strong>
                      <p>
                        {defaultAddress.addressLine1}
                        {defaultAddress.addressLine2
                          ? `, ${defaultAddress.addressLine2}`
                          : ''}
                        , {defaultAddress.city}, {defaultAddress.state},{' '}
                        {defaultAddress.country} - {defaultAddress.postalCode}
                      </p>
                      <p>{defaultAddress.phone}</p>
                    </div>
                  </div>
                )}

                {!defaultAddress && !showAddressForm && (
                  <div className={styles.addressBox}>
                    <FiMapPin />
                    <div>
                      <strong>No address added yet</strong>
                      <p>Add your preferred delivery address for checkout.</p>
                    </div>
                  </div>
                )}

                {showAddressForm && (
                  <form
                    className={styles.form}
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleAddressSubmit();
                    }}
                  >
                    <label>
                      Full Name
                      <div>
                        <FiUser />
                        <input
                          type="text"
                          placeholder="Enter full name"
                          value={addressForm.fullName}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              fullName: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </label>

                    <label>
                      Phone Number
                      <div>
                        <FiPhone />
                        <input
                          type="tel"
                          placeholder="Enter phone number"
                          value={addressForm.phone}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              phone: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </label>

                    <label>
                      Email
                      <div>
                        <FiMail />
                        <input
                          type="email"
                          placeholder="Enter email address"
                          value={addressForm.email}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              email: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </label>

                    <label>
                      Address Line 1
                      <div>
                        <FiMapPin />
                        <input
                          type="text"
                          placeholder="House / Flat / Street"
                          value={addressForm.addressLine1}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              addressLine1: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </label>

                    <label>
                      Address Line 2
                      <div>
                        <FiMapPin />
                        <input
                          type="text"
                          placeholder="Area / Landmark"
                          value={addressForm.addressLine2}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              addressLine2: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </label>

                    <label>
                      City
                      <div>
                        <FiMapPin />
                        <input
                          type="text"
                          placeholder="City"
                          value={addressForm.city}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              city: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </label>

                    <label>
                      State
                      <div>
                        <FiMapPin />
                        <input
                          type="text"
                          placeholder="State"
                          value={addressForm.state}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              state: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </label>

                    <label>
                      Country
                      <div>
                        <FiMapPin />
                        <input
                          type="text"
                          placeholder="Country"
                          value={addressForm.country}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              country: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </label>

                    <label>
                      Postal Code
                      <div>
                        <FiMapPin />
                        <input
                          type="text"
                          placeholder="Postal code"
                          value={addressForm.postalCode}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              postalCode: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </label>

                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={isAddressSaving}
                    >
                      {isAddressSaving ? 'Saving...' : 'Save Address'}
                      <FiArrowRight />
                    </button>
                  </form>
                )}
              </section>
            </div>
          </div>
        </section>

        {selectedOrder && (
          <div
            className={styles.orderModalOverlay}
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className={styles.orderModal}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.orderModalTop}>
                <div>
                  <span>Order Details</span>
                  <h2>{selectedOrder.orderNumber}</h2>
                </div>

                <button type="button" onClick={() => setSelectedOrder(null)}>
                  <FiX />
                </button>
              </div>

              <div className={styles.orderModalMeta}>
                <div>
                  <strong>Status</strong>
                  <p>{selectedOrder.status}</p>
                </div>

                <div>
                  <strong>Payment</strong>
                  <p>{selectedOrder.paymentStatus}</p>
                </div>

                <div>
                  <strong>Total</strong>
                  <p>
                    {formatMoney(
                      Number(selectedOrder.totalAmount || 0),
                      selectedOrder.currency || 'USD',
                    )}
                  </p>
                </div>
              </div>

              <div className={styles.orderProducts}>
                {selectedOrder.items.map((item) => (
                  <div className={styles.orderProductItem} key={item.id}>
                    <img
                      src={item.productImage || fallbackProduct.image}
                      alt={item.productTitle}
                    />

                    <div>
                      <h3>{item.productTitle}</h3>
                      <p>Quantity: {item.quantity}</p>
                      <p>
                        {formatMoney(
                          Number(item.totalPrice || 0),
                          selectedOrder.currency || 'USD',
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.shippingBox}>
                <strong>Shipping Address</strong>
                <p>{selectedOrder.shippingAddress}</p>
              </div>

              <div className={styles.invoiceActions}>
                <button
                  type="button"
                  className={styles.invoiceBtn}
                  onClick={() => window.print()}
                >
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className={styles.accountPage}>
      <section className={styles.authShell}>
        <div className={styles.visualPanel}>
          <img src={heroImage} alt="Artskart collector access" />

          <div className={styles.visualOverlay}>
            <span>Private Collector Access</span>
            <h1>Enter The Artskart Collector Circle.</h1>
            <p>
              Save artworks, manage orders and build your personal collection
              with a refined shopping experience.
            </p>

            <div className={styles.visualPoints}>
              <div>
                <FiCheckCircle />
                Curated artwork access
              </div>
              <div>
                <FiShield />
                Secure checkout experience
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formPanel}>
          <div className={styles.authCard}>
            <div className={styles.cardTop}>
              <span>Artskart Account</span>
              <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p>
                {mode === 'login'
                  ? 'Sign in to continue your collector journey.'
                  : 'Create your collector profile and save your favourite artworks.'}
              </p>
            </div>

            <div className={styles.tabs}>
              <button
                type="button"
                className={mode === 'login' ? styles.activeTab : ''}
                onClick={() => {
                  setMode('login');
                  resetForm();
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={mode === 'register' ? styles.activeTab : ''}
                onClick={() => {
                  setMode('register');
                  resetForm();
                }}
              >
                Create Account
              </button>
            </div>

            <form
              className={styles.form}
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
            >
              {mode === 'register' && (
                <label>
                  Full Name
                  <div>
                    <FiUser />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                    />
                  </div>
                </label>
              )}

              <label>
                Email Address
                <div>
                  <FiMail />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </label>

              {mode === 'register' && (
                <label>
                  Phone Number
                  <div>
                    <FiPhone />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </div>
                </label>
              )}

              <label>
                Password
                <div>
                  <FiLock />
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <FiEye />
                </div>
              </label>

              {mode === 'register' && (
                <label>
                  Confirm Password
                  <div>
                    <FiLock />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                    />
                  </div>
                </label>
              )}

              <div className={styles.formMeta}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={mode === 'login' ? false : acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                  />
                  <span>
                    {mode === 'login'
                      ? 'Remember me'
                      : 'I agree to the Terms & Privacy Policy'}
                  </span>
                </label>

                {mode === 'login' && (
                  <button type="button">Forgot password?</button>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Please wait...'
                  : mode === 'login'
                    ? 'Sign In Securely'
                    : 'Create Account'}
                <FiArrowRight />
              </button>

              <button type="button" className={styles.googleBtn}>
                Continue with Google
              </button>

              <Link to="/shop" className={styles.guestLink}>
                Continue as Guest
              </Link>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AccountPage;
