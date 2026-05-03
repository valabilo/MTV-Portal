'use client'
/**
 * components/layout/Header.jsx
 *
 * Sticky header with agency branding, global search bar, and nav links.
 */

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { NAV_ITEMS, AGENCY_NAME, REGION } from '@/lib/constants'
import styles from './Header.module.css'

export default function Header() {
  const router   = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    if (!search.trim()) return
    router.push(`/verify?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerTop}>
          {/* Branding */}
          <a href="/" className={styles.brand}>
            <div className={styles.logo}>🇵🇭</div>
            <div className={styles.brandText}>
              <span className={styles.republic}>Republic of the Philippines</span>
              <span className={styles.agency}>{AGENCY_NAME}</span>
              <span className={styles.region}>{REGION}</span>
            </div>
          </a>

          {/* Global search */}
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search plate number..."
              aria-label="Search plate number"
            />
            <button type="submit" aria-label="Search">🔍</button>
          </form>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav} aria-label="Main navigation">
        <div className="container">
          <ul className={styles.navList} role="list">
            {NAV_ITEMS.map(item => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={pathname === item.href ? styles.navLinkActive : styles.navLink}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
