import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
} from 'react-icons/fi';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <img src="/logo.png" alt="Artskart" />
          </Link>

          <p>
            Premium art collections crafted for collectors, luxury interiors,
            business spaces and refined gifting.
          </p>

          <div className={styles.contactMini}>
            <span>
              <FiPhone /> +91 93897 93416
            </span>
            <span>
              <FiMail /> info@artskart.co
            </span>
            <span>
              <FiMapPin /> Hyderabad, India
            </span>
          </div>
        </div>

        <div className={styles.newsletter}>
          <span>Collector Updates</span>
          <h3>Get new collections and B2B catalogue updates.</h3>

          <div className={styles.subscribeBox}>
            <input placeholder="Enter your email address" />
            <button type="button">
              Subscribe <FiArrowRight />
            </button>
          </div>
        </div>

        <div className={styles.links}>
          <div>
            <h4>Collections</h4>
            <Link to="/shop">Shop All</Link>
            <Link to="/shop/heritage">Heritage</Link>
            <Link to="/shop/landscapes">Landscapes</Link>
            <Link to="/shop/portraits">Portraits</Link>
          </div>

          <div>
            <h4>Company</h4>
            <Link to="/about">About Artskart</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/account">Account</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>

          <div>
            <h4>B2B</h4>
            <Link to="/b2b">B2B Partnerships</Link>
            <Link to="/b2b-enquiry">Become A Partner</Link>
            <Link to="/catalogue-request">Request Catalogue</Link>
            <Link to="/contact">Business Support</Link>
          </div>

          <div>
            <h4>Policies</h4>
            <Link to="/shipping-policy">Shipping Policy</Link>
            <Link to="/return-policy">Return Policy</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Artskart. All rights reserved.</p>

        <div>
          <span>
            <FiMessageCircle /> WhatsApp Support
          </span>
          <span>
            <FiInstagram /> Follow Artskart
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
