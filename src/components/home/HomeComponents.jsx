/**
 * components/home/QuickActions.jsx
 */
export function QuickActions() {
  const actions = [
    { icon: '📝', title: 'MTV Application', desc: 'Submit your application or check an existing application status.', href: '/apply',  cta: 'OPEN'  },
    { icon: '▶️', title: 'GHP Orientation', desc: 'Watch the required seminar before taking the quiz.',             href: '/ghp',    cta: 'WATCH NOW'  },
    { icon: '🔍', title: 'Verify MTV',       desc: 'Check the registration status of Meat Transport Vehicles.',     href: '/verify', cta: 'VERIFY NOW' },
  ]
  return (
    <section style={{ padding: '56px 0' }}>
      <div className="container">
        <div className="divider" />
        <h2 className="section-title">QUICK ACTIONS</h2>
        <p className="section-sub">Choose what you need to do today</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
          {actions.map(a => (
            <div key={a.title} style={{
              background: 'var(--white)', borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-sm)', padding: '28px 24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center', gap: '10px',
              border: '1px solid var(--gray-100)', transition: 'var(--transition)',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', marginBottom: 6,
              }}>{a.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{a.title}</h3>
              <p style={{ fontSize: '.88rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>{a.desc}</p>
              <a href={a.href} className="btn btn-primary btn-sm">{a.cta}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * components/home/ProcessSteps.jsx
 */
export function ProcessSteps() {
  const steps = [
    { icon: '📤', label: '1. SUBMIT',      desc: 'Submit accomplished form and requirements.' },
    { icon: '🔎', label: '2. REVIEW',      desc: 'We will review and validate your application.' },
    { icon: '💳', label: '3. PAYMENT',     desc: 'Pay the corresponding fees online or over-the-counter.' },
    { icon: '📜', label: '4. COR ISSUANCE',desc: 'Certificate of Registration (COR) will be issued.' },
  ]
  return (
    <section style={{ background: 'var(--gray-100)', padding: '56px 0' }}>
      <div className="container">
        <div className="divider" />
        <h2 className="section-title">MTV APPLICATION PROCESS</h2>
        <p className="section-sub">Four simple steps to get your Certificate of Registration</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, position: 'relative' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 16px' }}>
              <div style={{
                width: 76, height: 76, borderRadius: '50%',
                background: 'var(--white)', border: '3px solid var(--green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.9rem', marginBottom: 16, boxShadow: 'var(--shadow-sm)',
              }}>{s.icon}</div>
              <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--green)', marginBottom: 6 }}>{s.label}</h4>
              <p style={{ fontSize: '.85rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * components/home/CTAStrip.jsx
 */
export function CTAStrip() {
  return (
    <section style={{ background: 'linear-gradient(90deg,var(--green),var(--green-lt))', padding: '28px 0' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '2.4rem' }}>📁</span>
        <div>
          <h3 style={{ fontFamily: '"Public Sans",sans-serif', fontSize: '1.4rem', fontWeight: 800, color: 'var(--white)' }}>MTV APPLICATION</h3>
          <p style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.8)' }}>Submit requirements or check your application status in one place.</p>
        </div>
        <a href="/apply" className="btn btn-white">📋 OPEN APPLICATION</a>
      </div>
    </section>
  )
}

/**
 * components/home/InfoCards.jsx
 */
export function InfoCards() {
  return (
    <section style={{ padding: '56px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {/* Reminders */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--gray-100)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12, background: '#fffbeb', borderBottom: '1px solid #fef3c7' }}>
              <span style={{ fontSize: '1.6rem' }}>🔔</span>
              <h3 style={{ fontFamily: '"Public Sans",sans-serif', fontSize: '1.15rem', fontWeight: 800, color: '#92400e' }}>IMPORTANT REMINDERS</h3>
            </div>
            <div style={{ padding: 20 }}>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Ensure all required documents are complete.','Use a valid and active email address.','No duplicate or multiple submissions.','Ensure clear and readable scanned documents.','You will be notified through email regarding your application status.'].map((r,i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: '.9rem', color: 'var(--gray-700)', lineHeight: 1.5 }}>✅ {r}</li>
                ))}
              </ul>
              <br />
              <a href="/apply" className="btn btn-outline btn-sm">VIEW ALL REMINDERS</a>
            </div>
          </div>
          {/* Banned */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--gray-100)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12, background: '#fff5f5', borderBottom: '1px solid #fecaca' }}>
              <span style={{ fontSize: '1.6rem' }}>🚫</span>
              <h3 style={{ fontFamily: '"Public Sans",sans-serif', fontSize: '1.15rem', fontWeight: 800, color: 'var(--red)' }}>BANNED MTV LIST</h3>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
              <p style={{ fontSize: '.9rem', color: 'var(--gray-700)' }}>View the list of banned or suspended MTV units.</p>
              <span style={{ fontSize: '3rem', display: 'block', textAlign: 'center', width: '100%' }}>📋❌</span>
              <a href="/banned" className="btn btn-danger btn-sm">VIEW BANNED LIST</a>
            </div>
          </div>
          {/* Help */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--gray-100)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--blue-lt)', borderBottom: '1px solid #bde0f7' }}>
              <span style={{ fontSize: '1.6rem' }}>🎧</span>
              <h3 style={{ fontFamily: '"Public Sans",sans-serif', fontSize: '1.15rem', fontWeight: 800, color: 'var(--blue)' }}>NEED HELP?</h3>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
              <p style={{ fontSize: '.9rem', color: 'var(--gray-700)' }}>Visit our Help Page for FAQs and User Guide.</p>
              <span style={{ fontSize: '3rem', display: 'block', textAlign: 'center', width: '100%' }}>💬❓</span>
              <a href="/contact" className="btn btn-outline btn-sm" style={{ borderColor: 'var(--blue)', color: 'var(--blue)' }}>VISIT HELP PAGE</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * components/home/ContactBar.jsx
 */
export function ContactBar() {
  return (
    <section style={{ background: 'var(--gray-100)', padding: '40px 0', borderTop: '1px solid var(--gray-200)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--green)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>🏢 CONTACT US</h4>
            {[['🏛️','NMIS Central Luzon'],['✉️','nmis.clu@da.gov.ph'],['📞','Tel. No.: (045) 123-4567'],['📍','San Agustin, City of San Fernando, Pampanga, Philippines']].map(([icon,text],i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '.9rem', marginBottom: 8, color: 'var(--gray-700)' }}>
                <span style={{ width: 22, textAlign: 'center' }}>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--green)', marginBottom: 14 }}>🕐 OFFICE HOURS</h4>
            {[['📅','Monday – Friday'],['⏰','8:00 AM – 5:00 PM'],['🚫','Except Holidays']].map(([icon,text],i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '.9rem', marginBottom: 8, color: 'var(--gray-700)' }}>
                <span style={{ width: 22, textAlign: 'center' }}>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
