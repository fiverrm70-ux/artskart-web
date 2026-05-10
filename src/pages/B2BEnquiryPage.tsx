import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiAward,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPackage,
  FiPhone,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import styles from './B2BEnquiryPage.module.css';

const benefits = [
  { icon: <FiBox />, title: 'Bulk Artwork Supply' },
  { icon: <FiAward />, title: 'Curated Collections' },
  { icon: <FiMessageCircle />, title: 'Dedicated Support' },
  { icon: <FiPackage />, title: 'Premium Packaging' },
];

function B2BEnquiryPage() {
  const handleSubmit = () => {
    toast.success('B2B enquiry submitted successfully');
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span>B2B Partnership</span>
        <h1>Start Your Partnership With Artskart.</h1>
        <p>
          Share your business requirement and our team will assist you with
          curated artwork solutions, catalogue access and project support.
        </p>
      </section>

      <section className={styles.benefits}>
        {benefits.map((item) => (
          <div key={item.title}>
            {item.icon}
            <strong>{item.title}</strong>
          </div>
        ))}
      </section>

      <section className={styles.content}>
        <form className={styles.formCard}>
          <span>Partnership Enquiry</span>
          <h2>Tell us about your requirement.</h2>

          <div className={styles.formGrid}>
            <label>
              Full Name
              <input placeholder="Enter your full name" />
            </label>

            <label>
              Company Name
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
              Business Type
              <select defaultValue="">
                <option value="" disabled>
                  Select business type
                </option>
                <option>Interior Designer</option>
                <option>Hotel / Resort</option>
                <option>Retail Store</option>
                <option>Architect</option>
                <option>Corporate Office</option>
                <option>Online Seller</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Country
              <input placeholder="Enter country" />
            </label>

            <label>
              Project Requirement
              <input placeholder="Example: Hotel lobby artworks" />
            </label>

            <label>
              Quantity Needed
              <input placeholder="Example: 25 artworks" />
            </label>

            <label className={styles.full}>
              Message
              <textarea rows={6} placeholder="Write your requirement..." />
            </label>
          </div>

          <button type="button" onClick={handleSubmit}>
            Submit Partnership Enquiry
            <FiArrowRight />
          </button>
        </form>

        <aside className={styles.contactCard}>
          <span>Contact Team</span>
          <h2>Need quick assistance?</h2>
          <p>
            Connect with Artskart for catalogue access, project discussion and
            business support.
          </p>

          <div className={styles.contactList}>
            <div>
              <FiPhone />
              <strong>Phone</strong>
              <p>+91 93897 93416</p>
            </div>

            <div>
              <FiMessageCircle />
              <strong>WhatsApp</strong>
              <p>+91 93897 93416</p>
            </div>

            <div>
              <FiMail />
              <strong>Email</strong>
              <p>info@artskart.co</p>
              <p>support@artskart.co</p>
            </div>

            <div>
              <FiMapPin />
              <strong>Location</strong>
              <p>Hyderabad, India</p>
            </div>

            <div>
              <FiClock />
              <strong>Response</strong>
              <p>Average response within 24 hours</p>
            </div>
          </div>
        </aside>
      </section>

      <section className={styles.cta}>
        <div>
          <FiCheckCircle />
          <h2>Need curated artworks for your business?</h2>
          <p>Explore our premium catalogue or speak with the Artskart team.</p>
        </div>

        <div>
          <Link to="/shop">View Collection</Link>
          <Link to="/contact">Contact Team</Link>
        </div>
      </section>
    </main>
  );
}

export default B2BEnquiryPage;
