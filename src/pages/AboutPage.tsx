import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiHeart,
  FiShield,
  FiStar,
} from 'react-icons/fi';
import { products } from '../data/products';
import styles from './AboutPage.module.css';

const values = [
  {
    icon: <FiAward />,
    title: 'Curated Premium Artworks',
    description:
      'Every artwork is selected for refined interiors, statement spaces and luxury collectors.',
  },
  {
    icon: <FiShield />,
    title: 'Collector Quality Materials',
    description:
      'Premium archival papers, secure packaging and limited-edition production standards.',
  },
  {
    icon: <FiHeart />,
    title: 'Crafted With Artistic Storytelling',
    description:
      'Each collection carries visual depth, emotional connection and timeless artistic identity.',
  },
];

function AboutPage() {
  return (
    <main className={styles.aboutPage}>
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <span>About Artskart</span>

          <h1>
            Curating timeless artworks for refined collectors and premium
            interiors.
          </h1>

          <p>
            Artskart is built for art lovers who value premium aesthetics,
            limited-edition collections and elegant visual storytelling.
          </p>

          <Link to="/shop">
            Explore Collection
            <FiArrowRight />
          </Link>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={styles.storyContent}>
          <span>Our Story</span>

          <h2>Where art, luxury and collectible craftsmanship meet.</h2>

          <p>
            Artskart was created to bring premium curated artworks into modern
            interiors, collector spaces and elegant environments. We focus on
            timeless visual compositions designed to create emotional presence
            and sophisticated atmosphere.
          </p>

          <p>
            From heritage-inspired storytelling to refined landscapes and
            expressive portraits, every collection is selected to elevate the
            artistic experience beyond ordinary wall décor.
          </p>

          <div className={styles.storyPoints}>
            <div>
              <FiCheckCircle />
              Limited-edition premium collections
            </div>

            <div>
              <FiCheckCircle />
              Luxury-quality presentation standards
            </div>

            <div>
              <FiCheckCircle />
              Curated for collectors and modern interiors
            </div>
          </div>
        </div>

        <div className={styles.storyImage}>
          <img src={products[0].image} alt="Artskart collection" />
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className={styles.sectionHeading}>
          <span>Why Artskart</span>
          <h2>Built for premium art collectors.</h2>
        </div>

        <div className={styles.valuesGrid}>
          {values.map((value) => (
            <article className={styles.valueCard} key={value.title}>
              <div>{value.icon}</div>

              <h3>{value.title}</h3>

              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.promiseSection}>
        <div className={styles.promiseCard}>
          <span>Collector Promise</span>

          <h2>Premium presentation from artwork selection to delivery.</h2>

          <p>
            Every artwork is prepared with collector-focused packaging,
            presentation and careful handling to preserve quality and visual
            excellence.
          </p>

          <div className={styles.promiseFeatures}>
            <div>
              <FiStar />
              Archival quality prints
            </div>

            <div>
              <FiStar />
              Secure luxury packaging
            </div>

            <div>
              <FiStar />
              Premium collectible presentation
            </div>
          </div>

          <Link to="/shop">
            Shop Artworks
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
