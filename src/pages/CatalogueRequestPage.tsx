import { useState } from 'react';
import toast from 'react-hot-toast';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import {
  FiBox,
  FiBriefcase,
  FiClock,
  FiFileText,
  FiGlobe,
  FiMapPin,
  FiPackage,
  FiShield,
  FiTruck,
  FiUser,
  FiX,
} from 'react-icons/fi';
import styles from './CatalogueRequestPage.module.css';

function CatalogueRequestPage() {
  const [phone, setPhone] = useState('');

  const handleSubmit = () => {
    toast.success('Sample request submitted successfully');
  };

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <aside className={styles.leftPanel}>
          <div className={styles.logoBlock}>
            <h1>ARTSKART</h1>
            <p>Premium Art. Profitable Partnerships.</p>
          </div>

          <div className={styles.intro}>
            <span>Request Samples</span>
            <h2>Experience Our Premium Quality</h2>
            <div className={styles.line} />
            <p>
              Evaluate our materials and craftsmanship with free samples before
              placing bulk orders.
            </p>
          </div>

          <div className={styles.benefitList}>
            <div>
              <span>
                <FiBox />
              </span>
              <div>
                <strong>Premium Quality Samples</strong>
                <p>Feel the material and print quality</p>
              </div>
            </div>

            <div>
              <span>
                <FiGlobe />
              </span>
              <div>
                <strong>Free Worldwide Shipping</strong>
                <p>Samples shipped to your location at no extra cost</p>
              </div>
            </div>

            <div>
              <span>
                <FiShield />
              </span>
              <div>
                <strong>No Commitment</strong>
                <p>Request samples with no obligation</p>
              </div>
            </div>

            <div>
              <span>
                <FiClock />
              </span>
              <div>
                <strong>Quick Dispatch</strong>
                <p>Samples dispatched within 2–3 business days</p>
              </div>
            </div>
          </div>

          <div className={styles.materialVisual}>
            <img
              src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=90"
              alt="Premium artwork material samples"
            />
          </div>

          <div className={styles.shippingCard}>
            <FiTruck />
            <div>
              <strong>Free Worldwide Shipping</strong>
              <p>Simplifying global sourcing for our partners.</p>
              <hr />
              <small>
                Import duties or local taxes if applicable are the
                responsibility of the buyer.
              </small>
            </div>
          </div>
        </aside>

        <section className={styles.formPanel}>
          <button type="button" className={styles.closeBtn} aria-label="Close">
            <FiX />
          </button>

          <form className={styles.form}>
            <div className={styles.formSection}>
              <h3>
                <FiUser />
                1. Your Details
              </h3>

              <div className={styles.grid3}>
                <label>
                  Full Name <sup>*</sup>
                  <input placeholder="Enter your full name" />
                </label>

                <label>
                  Email Address <sup>*</sup>
                  <input placeholder="Enter your email address" />
                </label>

                <label>
                  WhatsApp Number <sup>*</sup>
                  <div className={styles.phoneField}>
                    <PhoneInput
                      defaultCountry="in"
                      value={phone}
                      onChange={setPhone}
                      placeholder="Enter your WhatsApp number"
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>
                <FiBriefcase />
                2. Business Details
              </h3>

              <div className={styles.grid2}>
                <label>
                  Business / Company Name <sup>*</sup>
                  <input placeholder="Enter your company name" />
                </label>

                <label>
                  Business Type <sup>*</sup>
                  <select defaultValue="">
                    <option value="" disabled>
                      Select your business type
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
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>
                <FiBox />
                3. Sample Requirements
              </h3>

              <div className={styles.requirementGrid}>
                <div>
                  <strong>
                    Product Type <sup>*</sup>
                  </strong>
                  <small>Select all that apply</small>

                  <label className={styles.checkRow}>
                    <input type="checkbox" />
                    Fine Art Boards
                  </label>
                  <label className={styles.checkRow}>
                    <input type="checkbox" />
                    Fine Art Papers
                  </label>
                  <label className={styles.checkRow}>
                    <input type="checkbox" />
                    Canvas Prints
                  </label>
                </div>

                <div>
                  <strong>Preferred Category (Optional)</strong>
                  <small>Select all that apply</small>

                  <label className={styles.checkRow}>
                    <input type="checkbox" />
                    Heritage
                  </label>
                  <label className={styles.checkRow}>
                    <input type="checkbox" />
                    Landscapes
                  </label>
                  <label className={styles.checkRow}>
                    <input type="checkbox" />
                    Portraits
                  </label>
                </div>

                <div>
                  <strong>
                    Sample Quantity <sup>*</sup>
                  </strong>

                  <label className={styles.radioRow}>
                    <input type="radio" name="samples" />1 – 3 samples
                  </label>
                  <label className={styles.radioRow}>
                    <input type="radio" name="samples" />3 – 5 samples
                  </label>
                  <label className={styles.radioRow}>
                    <input type="radio" name="samples" />
                    5+ samples
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>
                <FiMapPin />
                4. Shipping Details
              </h3>

              <div className={styles.grid2}>
                <label>
                  Country <sup>*</sup>
                  <select defaultValue="">
                    <option value="" disabled>
                      Select Country
                    </option>
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>United Arab Emirates</option>
                    <option>Singapore</option>
                    <option>Australia</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  City / Address <sup>*</sup>
                  <input placeholder="Enter your city / address" />
                </label>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>
                <FiFileText />
                5. Additional Information (Optional)
              </h3>

              <label>
                Message / Special Requirements
                <textarea
                  rows={4}
                  placeholder="Tell us about your requirements, preferred materials, or any other details..."
                />
              </label>
            </div>

            <button
              type="button"
              className={styles.submitBtn}
              onClick={handleSubmit}
            >
              <FiPackage />
              Request Samples
            </button>

            <p className={styles.reviewNote}>
              <FiShield />
              Our team will review your request and confirm sample availability
              within 24 hours.
            </p>
          </form>

          <div className={styles.bottomStrip}>
            <div>
              <FiPackage />
              <strong>Premium Quality</strong>
              <p>Feel the material & print quality</p>
            </div>

            <div>
              <FiGlobe />
              <strong>Free Shipping</strong>
              <p>Worldwide shipping support</p>
            </div>

            <div>
              <FiClock />
              <strong>Quick Dispatch</strong>
              <p>Samples dispatched quickly</p>
            </div>

            <div>
              <FiUser />
              <strong>Dedicated Support</strong>
              <p>We’re here to help you at every step</p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default CatalogueRequestPage;
