'use client'
/**
 * components/layout/Header.jsx
 *
 * Sticky header with agency branding, global lookup search, and nav links.
 */

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { NAV_ITEMS, AGENCY_NAME, REGION } from '@/lib/constants'
import styles from './Header.module.css'

const SEARCH_PLACEHOLDERS = {
  auto: 'Search MTV ref, plate, or GHP cert...',
  application: 'Application reference number...',
  mtv: 'Plate number or MTV number...',
  certificate: 'GHP certificate control number...',
}

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const [searchType, setSearchType] = useState('auto')

  function resolveSearchType(query) {
    const normalized = query.trim().toUpperCase()

    if (searchType !== 'auto') return searchType
    if (/^MTV-\d{4}-\d{5,6}$/.test(normalized)) return 'application'
    if (/^GHP[-\s]/.test(normalized) || /^CERT[-\s]/.test(normalized)) return 'certificate'
    return 'mtv'
  }

  function handleSearch(e) {
    e.preventDefault()
    const query = search.trim()
    if (!query) return

    const target = resolveSearchType(query)
    const encoded = encodeURIComponent(query)

    if (target === 'application') {
      router.push(`/apply?ref=${encoded}#application-status`)
      return
    }

    if (target === 'certificate') {
      router.push(`/certificate-verification?id=${encoded}`)
      return
    }

    router.push(`/verify?q=${encoded}`)
  }

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerTop}>
          <a href="/" className={styles.brand}>
            <span className={styles.logo}>
              <img src="/nmis-logo.svg" alt="NMIS logo" />
            </span>
            <div className={styles.brandText}>
              <span className={styles.republic}>Republic of the Philippines</span>
              <span className={styles.agency}>{AGENCY_NAME}</span>
              <span className={styles.region}>{REGION}</span>
            </div>
          </a>

          <form className={styles.searchForm} onSubmit={handleSearch}>
            <select
              value={searchType}
              onChange={e => setSearchType(e.target.value)}
              aria-label="Search type"
            >
              <option value="auto">Auto</option>
              <option value="application">Application Status</option>
              <option value="mtv">MTV Verification</option>
              <option value="certificate">GHP Certificate</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={SEARCH_PLACEHOLDERS[searchType]}
              aria-label="Search MTV application status, MTV verification, or GHP certificate"
            />
            <button type="submit" aria-label="Search">Search</button>
          </form>
        </div>
      </div>

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
                  {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
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
