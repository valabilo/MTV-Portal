'use client'
/**
 * components/ghp/CertCard.jsx
 *
 * Step 3 of the GHP flow.
 * - Collects name + email from the user
 * - Calls POST /api/ghp to validate score server-side and send certificate email
 * - Shows the issued certificate number on success
 *
 * NOTE: No link to the Apply page here. The GHP certificate is a standalone
 * credential. Users may optionally enter their certificate number when they
 * fill out an MTV application, but it is not enforced.
 *
 * Props:
 *   unlocked   {boolean}   True once quiz is passed
 *   quizScore  {number}    Number of correct answers
 *   showToast  {Function}
 */

import { useState } from 'react'
import { isValidEmail } from '@/lib/utils'
import { QUIZ_TOTAL }   from '@/data/quizData'
import styles from './CertCard.module.css'

export default function CertCard({ unlocked, quizScore, showToast }) {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [sending, setSending] = useState(false)
  const [issued,  setIssued]  = useState(null)   // { certNumber, issuedDate }

  async function handleClaim() {
    if (!name.trim())         { showToast('Please enter your full name.',         true); return }
    if (!email.trim())        { showToast('Please enter your email address.',     true); return }
    if (!isValidEmail(email)) { showToast('Please enter a valid email address.',  true); return }

    setSending(true)
    try {
      const res  = await fetch('/api/ghp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: name.trim(), email: email.trim(), score: quizScore }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setIssued({ certNumber: json.certNumber, issuedDate: json.issuedDate })
      showToast('✅ Certificate sent to your email!')
    } catch (err) {
      showToast(err.message || 'Failed to send certificate. Please try again.', true)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.card}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>🎓</div>
        <div className={styles.headerText}>
          <h3>Step 3 – Claim Your GHP Certificate</h3>
          <p>Enter your details to receive the certificate via email</p>
        </div>
        <span
          className={`tag ${!unlocked ? 'tag-locked' : issued ? 'tag-active' : 'tag-pending'}`}
          style={{ marginLeft: 'auto', flexShrink: 0 }}
        >
          {!unlocked ? '🔒 Locked' : issued ? '✅ Issued' : '📧 Pending'}
        </span>
      </div>

      <div className={styles.body}>

        {/* ── Locked state ── */}
        {!unlocked && (
          <div className={styles.lockedMsg}>
            🔒&nbsp; Pass the qualification quiz above to unlock your certificate.
          </div>
        )}

        {/* ── Certificate already issued ── */}
        {unlocked && issued && (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>🎉</div>
            <h4>Certificate Issued!</h4>
            <p>
              Your GHP Certificate of Completion has been sent to{' '}
              <strong>{email}</strong>.
            </p>
            <p style={{ fontSize: '.85rem', color: 'var(--gray-500)' }}>
              Please check your inbox (and spam folder) within a few minutes.
            </p>

            {/* Certificate details */}
            <div className={styles.certDetails}>
              <div className={styles.certRow}>
                <span>Certificate No.</span>
                <strong>{issued.certNumber}</strong>
              </div>
              <div className={styles.certRow}>
                <span>Date Issued</span>
                <strong>{issued.issuedDate}</strong>
              </div>
              <div className={styles.certRow}>
                <span>Quiz Score</span>
                <strong>
                  {quizScore}/{QUIZ_TOTAL}
                  &nbsp;({Math.round((quizScore / QUIZ_TOTAL) * 100)}%)
                </strong>
              </div>
            </div>

            {/* Info note — no Apply button, just a soft reference */}
            <div className={styles.infoNote}>
              📋 You may use your certificate number <strong>{issued.certNumber}</strong> as
              reference when submitting an MTV accreditation application. Visit the{' '}
              <a href="/apply" style={{ color: 'var(--green)', fontWeight: 700 }}>
                Submit Application
              </a>{' '}
              page when you are ready.
            </div>
          </div>
        )}

        {/* ── Claim form ── */}
        {unlocked && !issued && (
          <>
            <p className={styles.intro}>
              Congratulations on passing the GHP quiz! Enter your full name and
              email address to receive your official{' '}
              <strong>Certificate of Completion</strong>.
            </p>

            {/* Score preview */}
            <div className={styles.scorePreview}>
              <span>🏆</span>
              <span>
                Your score:&nbsp;
                <strong>{quizScore}/{QUIZ_TOTAL}</strong>
                &nbsp;·&nbsp;
                <strong>{Math.round((quizScore / QUIZ_TOTAL) * 100)}%</strong>
                &nbsp;— Pass ✅
              </span>
            </div>

            {/* Name field */}
            <div className={styles.formGroup}>
              <label htmlFor="cert_name">
                Full Name <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input
                id="cert_name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Juan Santos dela Cruz"
                disabled={sending}
              />
              <span className={styles.hint}>
                This name will appear on your certificate exactly as typed.
              </span>
            </div>

            {/* Email field */}
            <div className={styles.formGroup}>
              <label htmlFor="cert_email">
                Email Address <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input
                id="cert_email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={sending}
              />
              <span className={styles.hint}>
                The certificate will be sent here. Check your spam folder if you
                don't see it within 5 minutes.
              </span>
            </div>

            {/* Live certificate preview */}
            <div className={styles.certPreview}>
              <div className={styles.certPreviewHeader}>📜 Certificate Preview</div>
              <div className={styles.certPreviewBody}>
                <p>This is to certify that</p>
                <strong className={styles.certName}>
                  {name.trim() || '[ Your Name Here ]'}
                </strong>
                <p>
                  has successfully completed the online orientation seminar on
                  Good Hygiene Practices (GHP) for Meat Transport Vehicles.
                </p>
                <p className={styles.certMeta}>
                  Issued by NMIS Central Luzon &nbsp;·&nbsp; {new Date().getFullYear()}
                </p>
              </div>
            </div>

            {/* Send button */}
            <div className={styles.actions}>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleClaim}
                disabled={sending}
              >
                {sending ? '⏳ Sending Certificate…' : '📧 Send Certificate to My Email'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
