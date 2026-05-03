/**
 * app/apply/page.jsx - MTV Application Page (/apply)
 */

import { Suspense } from 'react'
import ApplicationForm from '@/components/apply/ApplicationForm'
import ApplicationStatusPanel from '@/components/apply/ApplicationStatusPanel'
import styles from './apply.module.css'

export const metadata = {
  title: 'MTV Application - MTV Portal',
}

export default function ApplyPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>MTV Application</h1>
          <p>Online submission for MTV registration requirements.</p>
        </div>
      </div>
      <div className={styles.page}>
        <div className="container">
          <section className={styles.intro}>
            <p>
              This online submission form facilitates efficient and standardized submission of MTV registration requirements. Provide accurate applicant and vehicle details, then upload clear documentary requirements for review.
            </p>
            <div className={styles.steps}>
              <article className={styles.step}>
                <h2>Step 1 - Prepare Requirements</h2>
                <p>Ensure all documentary requirements are complete, properly scanned, accomplished, and signed.</p>
              </article>
              <article className={styles.step}>
                <h2>Step 2 - Access the Form</h2>
                <p>Use your official company email address and enter the details from the MTV application form.</p>
              </article>
              <article className={styles.step}>
                <h2>Step 3 - Upload and Submit</h2>
                <p>Upload all required documents in the appropriate fields and double-check entries before submission.</p>
              </article>
            </div>
          </section>

          <ApplicationForm />
          <section className={styles.reminders}>
            <h2>Important Reminders</h2>
            <ul>
              <li>All documents must be clear, readable, and properly scanned.</li>
              <li>Review the requirements page before starting your application.</li>
              <li>Use only your official company email address where required.</li>
              <li>Ensure the application form is completely filled out and signed.</li>
              <li>Upload complete documentary requirements to avoid delays in processing.</li>
              <li>Multiple or duplicate submissions are not allowed.</li>
            </ul>
          </section>
          <Suspense fallback={<div className="spinner" />}>
            <ApplicationStatusPanel />
          </Suspense>
        </div>
      </div>
    </>
  )
}
