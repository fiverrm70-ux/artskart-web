import {
  FiArrowRight,
  FiClock,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
} from 'react-icons/fi';
import styles from './ContactPage.module.css';

function ContactPage() {
  return (
    <main className={styles.contactPage}>
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <span>Contact Artskart</span>

          <h1>
            Let’s connect for collector enquiries, support and premium artwork
            assistance.
          </h1>

          <p>
            Reach out for order support, artwork enquiries, collector assistance
            and premium business collaborations.
          </p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.infoPanel}>
          <span>Get In Touch</span>

          <h2>Premium collector support experience.</h2>

          <p>
            Our team is available for artwork enquiries, order assistance and
            collector support conversations.
          </p>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <FiPhone />

              <div>
                <strong>Phone & WhatsApp</strong>
                <p>+91 93897 93416</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FiMail />

              <div>
                <strong>Email</strong>
                <p>info@artskart.co</p>
                <p>support@artskart.co</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FiMapPin />

              <div>
                <strong>Location</strong>
                <p>Hyderabad, India</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <FiClock />

              <div>
                <strong>Support Hours</strong>
                <p>Mon - Sat • 10 AM - 7 PM</p>
              </div>
            </div>
          </div>

          <div className={styles.supportBox}>
            <FiMessageCircle />

            <div>
              <strong>Collector Assistance</strong>

              <p>
                Need help choosing artworks for interiors, gifting or premium
                spaces? Our support team can guide you.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.formPanel}>
          <div className={styles.formCard}>
            <span>Contact Form</span>

            <h2>Send us a message.</h2>

            <form className={styles.form}>
              <label>
                Full Name
                <input type="text" placeholder="Enter your full name" />
              </label>

              <label>
                Email Address
                <input type="email" placeholder="Enter your email address" />
              </label>

              <label>
                Phone Number
                <input type="tel" placeholder="Enter your phone number" />
              </label>

              <label>
                Subject
                <input type="text" placeholder="Enter subject" />
              </label>

              <label className={styles.full}>
                Message
                <textarea rows={6} placeholder="Write your message..." />
              </label>

              <button type="button">
                Send Message
                <FiArrowRight />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactPage;
