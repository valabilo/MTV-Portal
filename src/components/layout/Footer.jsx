import { COPYRIGHT, OFFICE_INFO } from '@/lib/constants'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain}><div className="container"><div className={styles.footerGrid}><div className={styles.footerBrand}><div className={styles.footerLogoWrap}><img src="/nmis-logo.svg" alt="NMIS Logo" className={styles.footerLogo} /></div><div><p className={styles.footerAgency}>National Meat Inspection Service</p><p className={styles.footerRegion}>Regional Technical Operation Center III</p><p className={styles.footerAddress}>{OFFICE_INFO.address}</p></div></div><div className={styles.footerLinks}><h4 className={styles.footerHeading}>Quick Links</h4><ul><li><a href="/requirements">Requirements</a></li><li><a href="/ghp">GHP Orientation</a></li><li><a href="/apply">MTV Application</a></li><li><a href="/verify">Verify MTV</a></li><li><a href="/banned">Banned List</a></li></ul></div><div className={styles.footerLinks}><h4 className={styles.footerHeading}>Contact</h4><ul><li><a href={`tel:${OFFICE_INFO.phone}`}>{OFFICE_INFO.phone}</a></li><li><a href={`mailto:${OFFICE_INFO.email}`}>{OFFICE_INFO.email}</a></li><li><span>Mon–Fri, 8:00 AM–5:00 PM</span></li></ul></div></div></div></div>
      <div className={styles.footerBottom}><div className="container"><div className={styles.footerBottomInner}><p>© {COPYRIGHT}</p><div className={styles.footerBottomLinks}><a href="/contact">Privacy Policy</a><span>·</span><a href="/contact">Terms of Use</a><span>·</span><a href="/contact">Accessibility</a></div></div></div></div>
    </footer>
  )
}
