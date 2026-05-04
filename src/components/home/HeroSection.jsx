/**
 * components/home/HeroSection.jsx
 */

import styles from "./HeroSection.module.css";

function StatIcon({ type }) {
  if (type === "truck") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v8h2.6l1.4-2.5h2V14h1v2h-1.2a2.8 2.8 0 0 1-5.6 0H8.8a2.8 2.8 0 0 1-5.6 0H2v-2h1V6Zm3 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm11 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>
    );
  }
  if (type === "pig") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 11a5 5 0 0 1 5-5h6a4 4 0 0 1 4 4v2h2v2h-2.2a4 4 0 0 1-3.8 3h-1v2h-2v-2H9v2H7v-2.3A4.5 4.5 0 0 1 3 12.2V11h2Zm4.5-.5a1 1 0 1 0 .01 0ZM14 13h3v1a1.5 1.5 0 0 1-3 0v-1Z"/></svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12c0-3.3 2.7-6 6-6h4.5c1.9 0 3.4 1.5 3.4 3.4V11H20v2h-2.3c-.5 2-2.3 3.5-4.4 3.5H9c-3.3 0-6-1.2-6-4.5Zm5-1.5a1 1 0 1 0 .01 0Zm3 0a1 1 0 1 0 .01 0Zm7 5.5h2v2h-2z"/></svg>
  );
}

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div>
          <div className={styles.badge}>Official Government Service Portal</div>
          <h1 className={styles.title}>Meat Transport Vehicle (MTV) Portal</h1>
          <h2 className={styles.subtitle}>Professional digital processing for registration and compliance</h2>
          <p>
            Streamlined for operators, inspectors, and establishments: review requirements,
            submit applications, verify records, and complete orientation with transparent
            processing status.
          </p>
          <div className={styles.actions}>
            <a href="/apply" className="btn btn-white">Start MTV Application</a>
            <a href="/verify" className={styles.btnOutlineWhite}>Verify Registration</a>
          </div>
        </div>

        <div className={styles.portalCard}>
          <h3>Sector Snapshot</h3>
          <div className={styles.statList}>
            <div className={styles.statItem}><span className={styles.statIcon}><StatIcon type="truck"/></span><div><strong>Transport Units</strong><p>Registration, renewal, and audit-ready profiles.</p></div></div>
            <div className={styles.statItem}><span className={styles.statIcon}><StatIcon type="pig"/></span><div><strong>Swine Logistics</strong><p>Support compliant movement for pork supply chains.</p></div></div>
            <div className={styles.statItem}><span className={styles.statIcon}><StatIcon type="chicken"/></span><div><strong>Poultry Movement</strong><p>Track and document biosecure poultry transport.</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
