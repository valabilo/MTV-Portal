'use client'
/**
 * app/contact/page.jsx  –  Contact Us Page (/contact)
 */

import { useState } from 'react'
import { useToast } from '@/hooks/useToast'
import Toast        from '@/components/ui/Toast'
import { OFFICE_INFO, DEMO_FAQS } from '@/lib/constants'
import { DEMO_FAQS as FAQS } from '@/data/demoData'
import styles from './contact.module.css'

const SUBJECTS = [
  'Application Inquiry','Status Follow-up','Document Requirements',
  'Complaint / Report','General Inquiry',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [sending, setSending] = useState(false)
  const [openFAQ, setOpenFAQ] = useState(null)
  const { toastState, showToast } = useToast()

  function update(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  async function handleSend() {
    if (!form.name || !form.email || !form.subject || !form.message) {
      showToast('Please fill in all required fields.', true)
      return
    }
    setSending(true)
    try {
      const res  = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      showToast('Message sent! We will get back to you within 1-3 working days.')
      setForm({ name:'', email:'', phone:'', subject:'', message:'' })
    } catch {
      showToast('Failed to send. Please email us directly at nmis.clu@da.gov.ph', true)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>✉️ Contact Us</h1>
          <p>Reach out to NMIS Central Luzon for inquiries and assistance.</p>
        </div>
      </div>

      <div style={{ padding: '40px 0' }}>
        <div className="container">
          <div className={styles.grid}>

            {/* Office info */}
            <div>
              <div className={styles.infoCard}>
                <h3>📍 Office Information</h3>
                {[
                  ['🏛️','Office Name',  'National Meat Inspection Service\nCentral Luzon Regional Office'],
                  ['📍','Address',      'San Agustin, City of San Fernando,\nPampanga, Philippines 2000'],
                  ['📞','Phone',        '(045) 123-4567'],
                  ['✉️','Email',        'nmis.clu@da.gov.ph'],
                  ['⏰','Office Hours', 'Monday–Friday: 8:00 AM – 5:00 PM\n(Except Public Holidays)'],
                ].map(([icon, label, value]) => (
                  <div key={label} className={styles.detail}>
                    <div className={styles.detailIcon}>{icon}</div>
                    <div>
                      <h4>{label}</h4>
                      {value.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.mapPlaceholder}>🗺️</div>
            </div>

            {/* Contact form + FAQs */}
            <div className={styles.formCard}>
              <h3>💬 Send a Message</h3>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label htmlFor="c_name">Full Name <span className="req">*</span></label>
                <input id="c_name" type="text" value={form.name}    onChange={e => update('name', e.target.value)}    placeholder="Your full name" />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label htmlFor="c_email">Email Address <span className="req">*</span></label>
                <input id="c_email" type="email" value={form.email}   onChange={e => update('email', e.target.value)}   placeholder="your@email.com" />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label htmlFor="c_phone">Contact Number</label>
                <input id="c_phone" type="tel" value={form.phone}   onChange={e => update('phone', e.target.value)}   placeholder="09XX-XXX-XXXX" />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label htmlFor="c_subject">Subject <span className="req">*</span></label>
                <select id="c_subject" value={form.subject} onChange={e => update('subject', e.target.value)}>
                  <option value="">-- Select Subject --</option>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label htmlFor="c_message">Message <span className="req">*</span></label>
                <textarea id="c_message" rows={5} value={form.message} onChange={e => update('message', e.target.value)} placeholder="Write your message here..." />
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={handleSend}
                disabled={sending}
              >
                {sending ? '⏳ Sending…' : '✉️ SEND MESSAGE'}
              </button>

              {/* FAQs */}
              <div style={{ marginTop: 32 }}>
                <h3 className={styles.faqTitle}>❓ Frequently Asked Questions</h3>
                {FAQS.map((f, i) => (
                  <div key={i} className={styles.faqItem}>
                    <button
                      className={styles.faqQ}
                      onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                      aria-expanded={openFAQ === i}
                    >
                      {f.q}
                      <span aria-hidden="true">{openFAQ === i ? '−' : '+'}</span>
                    </button>
                    {openFAQ === i && (
                      <div className={styles.faqA}>{f.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast {...toastState} />
    </>
  )
}
