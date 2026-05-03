/**
 * components/home/HeroSection.jsx
 */

import styles from './HeroSection.module.css'

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div>
          <div className={styles.badge}>🏛️ Official Government Portal</div>
          <h1 className={styles.title}>MTV PORTAL<br />SYSTEM</h1>
          <h2 className={styles.subtitle}>One-Stop Platform for MTV Registration and Compliance</h2>
          <p>
            Access information, attend orientation, take the quiz, submit your
            application and track your status online.
          </p>
          <div className={styles.actions}>
            <a href="/apply"  className="btn btn-white">📋 SUBMIT APPLICATION</a>
            <a href="/verify" className={styles.btnOutlineWhite}>🔍 VERIFY MTV</a>
          </div>
        </div>
        <div className={styles.truck} aria-hidden="true">🚛</div>
      </div>
    </section>
  )
}
