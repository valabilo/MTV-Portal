/**
 * components/layout/Footer.jsx
 */

import { COPYRIGHT } from '@/lib/constants'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span>{COPYRIGHT} | This portal is maintained by NMIS.</span>
        <div className={styles.links}>
          <a href="/contact">Privacy Policy</a>
          <a href="/contact">Terms of Use</a>
        </div>
      </div>
    </footer>
  )
}
