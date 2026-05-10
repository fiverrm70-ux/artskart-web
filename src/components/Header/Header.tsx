import { Link, NavLink } from 'react-router-dom';
import { FiHeart, FiMenu, FiShoppingBag, FiUser, FiX } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import logo from '../../assets/logo.png';
import styles from './Header.module.css';

function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);

    onScroll();
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <button
          type="button"
          className={styles.mobileMenuBtn}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <nav className={`${styles.leftNav} ${menuOpen ? styles.show : ''}`}>
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/shop/heritage" onClick={closeMenu}>
            Heritage
          </NavLink>
          <NavLink to="/shop/landscapes" onClick={closeMenu}>
            Landscapes
          </NavLink>
          <NavLink to="/shop/portraits" onClick={closeMenu}>
            Portraits
          </NavLink>
        </nav>

        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <img src={logo} alt="Artskart" />
        </Link>

        <div className={styles.mobileHeaderActions}>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className={styles.cartLink}
            onClick={closeMenu}
          >
            <FiHeart />
            {wishlistCount > 0 && (
              <span className={styles.cartBadge}>{wishlistCount}</span>
            )}
          </Link>

          <Link
            to="/cart"
            aria-label="Cart"
            className={styles.cartLink}
            onClick={closeMenu}
          >
            <FiShoppingBag />
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </Link>

          <Link to="/account" aria-label="Account" onClick={closeMenu}>
            <FiUser />
          </Link>
        </div>

        <nav className={`${styles.rightNav} ${menuOpen ? styles.show : ''}`}>
          <NavLink to="/shop" onClick={closeMenu}>
            Shop All
          </NavLink>
          <NavLink to="/b2b" onClick={closeMenu}>
            B2B
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu}>
            Contact Us
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>

          <div className={styles.actions}>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className={styles.cartLink}
              onClick={closeMenu}
            >
              <FiHeart />
              {wishlistCount > 0 && (
                <span className={styles.cartBadge}>{wishlistCount}</span>
              )}
            </Link>

            <Link
              to="/cart"
              aria-label="Cart"
              className={styles.cartLink}
              onClick={closeMenu}
            >
              <FiShoppingBag />
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </Link>

            <Link to="/account" aria-label="Account" onClick={closeMenu}>
              <FiUser />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
