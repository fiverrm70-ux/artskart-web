import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import HomePage from '../pages/HomePage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import ShopPage from '../pages/ShopPage';
import WishlistPage from '../pages/WishlistPage';
import AccountPage from '../pages/AccountPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import B2BPage from '../pages/B2BPage';
import B2BEnquiryPage from '../pages/B2BEnquiryPage';
import CatalogueRequestPage from '../pages/CatalogueRequestPage';
import NotFoundPage from '../pages/NotFoundPage';
function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:categorySlug" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductDetailsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/b2b" element={<B2BPage />} />
        <Route path="/b2b-enquiry" element={<B2BEnquiryPage />} />
        <Route path="/catalogue-request" element={<CatalogueRequestPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
}

export default AppRoutes;
