import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiAward,
  FiBox,
  FiCheckCircle,
  FiDownload,
  FiGlobe,
  FiGrid,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPackage,
  FiShoppingBag,
  FiStar,
  FiTruck,
} from 'react-icons/fi';
import { products } from '../data/products';
import styles from './B2BPage.module.css';

const partnershipModels = [
  {
    icon: <FiBox />,
    title: 'Wholesale Supply',
    text: 'Bulk artwork sourcing for retail, online sellers and project-based requirements.',
  },
  {
    icon: <FiShoppingBag />,
    title: 'Dealership Program',
    text: 'Offer curated Artskart collections through your local or regional business.',
  },
  {
    icon: <FiGlobe />,
    title: 'Distribution',
    text: 'Regional artwork supply opportunities with catalogue and project support.',
  },
  {
    icon: <FiGrid />,
    title: 'Franchise Model',
    text: 'Build an Artskart-branded retail or gallery-style business presence.',
  },
];

const advantages = [
  'Bulk artwork curation',
  'Dedicated project support',
  'Premium packaging',
  'Catalogue access',
  'Custom sizing options',
];

const operations = [
  {
    icon: <FiTruck />,
    title: 'Delivery Coordination',
    text: 'Support for organized project dispatches and artwork handling.',
  },
  {
    icon: <FiPackage />,
    title: 'Secure Packaging',
    text: 'Protective packaging suitable for premium artwork movement.',
  },
  {
    icon: <FiAward />,
    title: 'Catalogue Support',
    text: 'Curated collection access for client presentations and sourcing.',
  },
  {
    icon: <FiStar />,
    title: 'Partner Benefits',
    text: 'Priority updates for new artwork collections and project-friendly support.',
  },
];

function B2BPage() {
  return (
    <main className={styles.b2bPage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span>Global B2B Partnerships</span>

          <h1>Premium Art. Profitable Partnerships.</h1>

          <p className={styles.heroTags}>
            Wholesale <b>|</b> Dealership <b>|</b> Distribution <b>|</b>{' '}
            Franchise
          </p>

          <p className={styles.heroText}>
            We create archival-quality art products designed for premium spaces,
            refined interiors and scalable business partnerships.
          </p>

          <div className={styles.heroActions}>
            <Link to="/b2b-enquiry">
              Become A Partner
              <FiArrowRight />
            </Link>

            <Link to="/catalogue-request">
              Request Catalogue
              <FiDownload />
            </Link>
          </div>

          <div className={styles.accessNote}>
            <FiCheckCircle />
            Access pricing, samples and partnership details.
          </div>
        </div>

        <div className={styles.heroVisual}>
          <img src={products[1].image} alt="Artskart B2B artwork display" />
          <div className={styles.floatingFrame}>
            <img src={products[2].image} alt="Framed artwork" />
          </div>
        </div>
      </section>

      <section className={styles.modelsSection}>
        <div className={styles.sectionTitle}>
          <h2>Partnership Models</h2>
          <p>Select the partnership model aligned with your business goals.</p>
        </div>

        <div className={styles.modelGrid}>
          {partnershipModels.map((model) => (
            <article className={styles.modelCard} key={model.title}>
              <div>{model.icon}</div>
              <h3>{model.title}</h3>
              <p>{model.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.advantagesStrip}>
        {advantages.map((item) => (
          <div key={item}>
            <FiCheckCircle />
            <span>{item}</span>
          </div>
        ))}
      </section>

      <section className={styles.materialsSection}>
        <div className={styles.materialContent}>
          <span>Materials & Custom Production</span>
          <h2>Engineered for premium positioning and scalable supply.</h2>

          <div className={styles.materialGrid}>
            <div>
              <strong>Fine Art Papers</strong>
              <p>Archival-grade paper options for luxury presentation.</p>
            </div>
            <div>
              <strong>Art Boards</strong>
              <p>Premium boards for framed, gallery and décor products.</p>
            </div>
            <div>
              <strong>Canvas Prints</strong>
              <p>High-quality canvas suitable for hospitality and interiors.</p>
            </div>
            <div>
              <strong>Custom Sizes</strong>
              <p>Project-ready formats for different wall and space needs.</p>
            </div>
          </div>
        </div>

        <div className={styles.materialImage}>
          <img
            src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=90"
            alt="Premium artwork material"
          />
        </div>
      </section>

      <section className={styles.infoBlocks}>
        <article>
          <span>Sustainability</span>
          <h3>Eco-conscious production approach.</h3>
          <ul>
            <li>Eco-conscious material selection</li>
            <li>Archival-grade production standards</li>
            <li>Durable artwork formats for long-term use</li>
          </ul>
        </article>

        <article>
          <span>Custom Printing</span>
          <h3>Project and client-supplied artwork support.</h3>
          <ul>
            <li>Custom artwork sizing</li>
            <li>Private label presentation options</li>
            <li>Packaging customization support</li>
          </ul>
        </article>

        <article>
          <span>Pricing & Shipping</span>
          <h3>Transparent business support.</h3>
          <ul>
            <li>Catalogue-based pricing support</li>
            <li>Project-level dispatch coordination</li>
            <li>Clear communication for business orders</li>
          </ul>
        </article>
      </section>

      <section className={styles.operationsSection}>
        {operations.map((item) => (
          <div key={item.title}>
            {item.icon}
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </div>
        ))}
      </section>

      <section className={styles.partnerSection}>
        <div className={styles.partnerBox}>
          <h2>Why Partner With Artskart?</h2>

          <div className={styles.checkList}>
            <span>
              <FiCheckCircle /> Premium archival-quality products
            </span>
            <span>
              <FiCheckCircle /> High-margin potential categories
            </span>
            <span>
              <FiCheckCircle /> Eco-conscious production approach
            </span>
            <span>
              <FiCheckCircle /> Scalable supply capability
            </span>
          </div>
        </div>

        <div className={styles.partnerBox}>
          <h2>Ideal Partners</h2>

          <div className={styles.checkList}>
            <span>
              <FiCheckCircle /> Retail stores
            </span>
            <span>
              <FiCheckCircle /> Interior designers
            </span>
            <span>
              <FiCheckCircle /> Online sellers
            </span>
            <span>
              <FiCheckCircle /> Corporate buyers
            </span>
          </div>
        </div>

        <div className={styles.privateBox}>
          <h2>Customization & Private Label</h2>
          <p>
            Custom sizes, white labelling, exclusive collections and packaging
            customization for business partners.
          </p>
        </div>
      </section>

      <section className={styles.collectionStrip}>
        <div>
          <h2>Explore Our Collection</h2>
          <p>Discover curated art collections crafted for premium spaces.</p>
        </div>

        <div className={styles.collectionImages}>
          {products.map((product) => (
            <img src={product.image} alt={product.title} key={product.id} />
          ))}
        </div>

        <div className={styles.collectionActions}>
          <Link to="/shop">View Catalogue</Link>
          <button type="button">
            Download PDF
            <FiDownload />
          </button>
        </div>
      </section>

      <section className={styles.enquirySection} id="b2b-enquiry">
        <div className={styles.enquiryContent}>
          <span>Start Your Partnership</span>
          <h2>Start your partnership with Artskart.</h2>
          <p>
            Share your project, business type or catalogue requirement. Our team
            will contact you with the next steps.
          </p>

          <div className={styles.contactStrip}>
            <div>
              <FiMail />
              <span>info@artskart.co</span>
            </div>
            <div>
              <FiMessageCircle />
              <span>+91 93897 93416</span>
            </div>
            <div>
              <FiMapPin />
              <span>Hyderabad, India</span>
            </div>
          </div>
        </div>

        <form className={styles.enquiryForm}>
          <label>
            Full Name
            <input placeholder="Enter your name" />
          </label>

          <label>
            Company / Studio Name
            <input placeholder="Enter company name" />
          </label>

          <label>
            Phone Number
            <input placeholder="Enter phone number" />
          </label>

          <label>
            Email Address
            <input placeholder="Enter email address" />
          </label>

          <label>
            Project Type
            <select defaultValue="">
              <option value="" disabled>
                Select project type
              </option>
              <option>Hotel / Resort</option>
              <option>Interior Design Project</option>
              <option>Retail / Online Store</option>
              <option>Corporate Office</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Quantity Required
            <input placeholder="Example: 25 artworks" />
          </label>

          <label className={styles.full}>
            Message
            <textarea rows={5} placeholder="Tell us about your requirement" />
          </label>

          <button type="button">
            Submit Enquiry
            <FiArrowRight />
          </button>
        </form>
      </section>
    </main>
  );
}

export default B2BPage;
