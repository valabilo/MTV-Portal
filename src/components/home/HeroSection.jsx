/**
 * components/home/HeroSection.jsx
 */

import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div>
          <div className={styles.badge}>Official Government Portal</div>
          <h1 className={styles.title}>
            MTV Portal
            <br />
            System
          </h1>
          <h2 className={styles.subtitle}>
            One-stop platform for MTV registration and compliance
          </h2>
          <p>
            Review requirements, complete GHP orientation, submit your MTV
            application, and verify records in one organized portal.
          </p>
          <div className={styles.actions}>
            <a href="/apply" className="btn btn-white">
              MTV Application
            </a>
            <a href="/verify" className={styles.btnOutlineWhite}>
              Verify MTV
            </a>
          </div>
        </div>

        <div className={styles.portalCard} aria-hidden="true">
          <div className={styles.cardTopline} />
          <div className={styles.vehicleShape}>
            <span />
            <span />
          </div>
          <div className={styles.cardRows}>
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
