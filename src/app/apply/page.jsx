/**
 * app/apply/page.jsx - MTV Application Page (/apply)
 */

import { Suspense } from 'react'
import ApplicationForm from '@/components/apply/ApplicationForm'
import ApplicationStatusPanel from '@/components/apply/ApplicationStatusPanel'

export const metadata = {
  title: 'MTV Application - MTV Portal',
}

export default function ApplyPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>MTV Application</h1>
          <p>Submit an MTV accreditation application or check an existing application status.</p>
        </div>
      </div>
      <div style={{ padding: '40px 0' }}>
        <div className="container">
          <ApplicationForm />
          <Suspense fallback={<div className="spinner" />}>
            <ApplicationStatusPanel />
          </Suspense>
        </div>
      </div>
    </>
  )
}
