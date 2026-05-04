'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { NAV_ITEMS, AGENCY_NAME, REGION } from '@/lib/constants'
import styles from './Header.module.css'

const SEARCH_PLACEHOLDERS = {
  auto: 'Search by ref. no., plate, or certificate...',
  application: 'Application reference number...',
  mtv: 'Plate number or MTV number...',
  certificate: 'GHP certificate control number...',
}

export default function Header() { const router=useRouter(); const pathname=usePathname(); const [search,setSearch]=useState(''); const [searchType,setSearchType]=useState('auto'); const [menuOpen,setMenuOpen]=useState(false); const [scrolled,setScrolled]=useState(false); useEffect(()=>{const h=()=>setScrolled(window.scrollY>8);window.addEventListener('scroll',h,{passive:true});return()=>window.removeEventListener('scroll',h)},[]); useEffect(()=>setMenuOpen(false),[pathname]);
function resolveSearchType(q){const n=q.trim().toUpperCase(); if(searchType!=='auto') return searchType; if(/^MTV-\d{4}-\d{5,6}$/.test(n)) return 'application'; if(/^GHP[-\s]/.test(n)) return 'certificate'; return 'mtv'}
function handleSearch(e){e.preventDefault();const q=search.trim();if(!q)return; const t=resolveSearchType(q); const en=encodeURIComponent(q); if(t==='application'){router.push(`/apply?ref=${en}#application-status`);return} if(t==='certificate'){router.push(`/certificate-verification?id=${en}`);return} router.push(`/verify?q=${en}`)}
return <header className={`${styles.header} ${scrolled?styles.scrolled:''}`}><div className={styles.govRibbon}><div className="container"><div className={styles.govRibbonInner}><span>🇵🇭 Official Government Portal</span><span>Republic of the Philippines · Department of Agriculture</span></div></div></div><div className={styles.headerMain}><div className="container"><div className={styles.headerInner}><a href="/" className={styles.brand}><div className={styles.logoWrap}><img src="/nmis-logo.svg" alt="NMIS Logo" className={styles.logo} /></div><div className={styles.brandText}><span className={styles.brandAgency}>{AGENCY_NAME}</span><span className={styles.brandRegion}>{REGION}</span></div></a><form className={styles.searchForm} onSubmit={handleSearch}><div className={styles.searchTypeWrap}><select value={searchType} onChange={e=>setSearchType(e.target.value)} className={styles.searchType}><option value="auto">All</option><option value="application">Application</option><option value="mtv">MTV</option><option value="certificate">Certificate</option></select></div><input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder={SEARCH_PLACEHOLDERS[searchType]} className={styles.searchInput} /><button type="submit" className={styles.searchBtn}>Search</button></form><button className={styles.menuBtn} onClick={()=>setMenuOpen(!menuOpen)}><span className={`${styles.menuIcon} ${menuOpen ? styles.menuOpen : ''}`}><span /><span /><span /></span></button></div></div></div><nav className={`${styles.nav} ${menuOpen?styles.navOpen:''}`}><div className="container"><ul className={styles.navList}>{NAV_ITEMS.map(item=>{const a=pathname===item.href;return <li key={item.id}><a href={item.href} className={`${styles.navLink} ${a?styles.navLinkActive:''}`}>{item.label}</a></li>})}</ul></div></nav></header> }
