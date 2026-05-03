/**
 * app/apply/page.jsx  –  Submit Application Page (/apply)
 */

import ApplicationForm from '@/components/apply/ApplicationForm'

export const metadata = {
  title: 'Submit Application – MTV Portal',
}

export default function ApplyPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>📋 Submit Application</h1>
          <p>Complete the online application form for MTV accreditation.</p>
        </div>
      </div>
      <div style={{ padding: '40px 0' }}>
        <div className="container">
          <ApplicationForm />
        </div>
      </div>
    </>
  )
}
