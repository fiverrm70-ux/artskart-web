import { Link } from 'react-router-dom';
import { FiArrowLeft, FiGrid, FiMail } from 'react-icons/fi';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <span>404</span>

        <h1>Artwork Not Found.</h1>

        <p>
          The page you’re looking for may have been moved, removed or is
          currently unavailable.
        </p>

        <div className={styles.actions}>
          <Link to="/">
            <FiArrowLeft />
            Go Home
          </Link>

          <Link to="/shop">
            <FiGrid />
            Shop Collection
          </Link>

          <Link to="/contact">
            <FiMail />
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFoundPage;
