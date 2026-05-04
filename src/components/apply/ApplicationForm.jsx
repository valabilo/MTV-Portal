'use client'
/**
 * components/apply/ApplicationForm.jsx
 *
 * Orchestrates the 4-step MTV application form.
 * Documents are converted to base64 and uploaded to Google Drive
 * via the /api/applications endpoint.
 *
 * GHP orientation is completely separate — users do NOT need to
 * complete GHP before applying here.
 */

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useToast }       from '@/hooks/useToast'
import { REQUIRED_DOCS }  from '@/data/requiredDocs'
import Toast              from '@/components/ui/Toast'
import FormProgress       from './FormProgress'
import Step1Applicant     from './Step1Applicant'
import Step2Vehicle       from './Step2Vehicle'
import Step3Documents     from './Step3Documents'
import Step4Review        from './Step4Review'
import SuccessView        from './SuccessView'
import styles             from './ApplicationForm.module.css'

const DRAFT_KEY = 'mtv_application_draft_v1'

const INITIAL_FORM = {
  applicationType: 'New',
  firstname: '', lastname: '', middlename: '', suffix: '',
  email: '', contact: '', address: '', region: 'III', province: '',
  ownerName: '', operatorName: '', businessTin: '',
  plate: '', vtype: '', vmake: '', vmodel: '', vyear: '', vcolor: '',
  vengine: '', vchassis: '', crNumber: '', orNumber: '', ltoClientId: '',
  bodyType: '', fuelType: '', cooling: '', capacity: '', grossWeight: '',
  netCapacity: '', material: '', meatEstablishment: '', intendedRoute: '',
  bname: '', btype: '', baddress: '',
  ghpCertNumber: '',
}

export default function ApplicationForm() {
  const [step,       setStep]      = useState(1)
  const [formData,   setFormData]  = useState(INITIAL_FORM)
  const [files,      setFiles]     = useState({})        // { docId: File }
  const [agree,      setAgree]     = useState(false)
  const [refNumber,  setRefNumber] = useState('')
  const [submitted,  setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [validatingGhp, setValidatingGhp] = useState(false)
  const [optimisticMessage, setOptimisticMessage] = useState('')
  const [, startTransition] = useTransition()

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (!saved) return
      const draft = JSON.parse(saved)
      if (draft?.formData) setFormData(prev => ({ ...prev, ...draft.formData }))
      if (typeof draft?.step === 'number') setStep(Math.min(Math.max(draft.step, 1), 4))
      if (typeof draft?.agree === 'boolean') setAgree(draft.agree)
    } catch {
      // Ignore corrupted or unavailable local draft payloads.
    }
  }, [])

  useEffect(() => {
    const payload = { formData, step, agree, updatedAt: Date.now() }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
  }, [formData, step, agree])


  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const hasData = Object.values(formData).some(value => String(value ?? '').trim())
      if (!submitted && hasData) {
        event.preventDefault()
        event.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [formData, submitted])

    const { toastState, showToast } = useToast()
  const submissionId = useMemo(
    () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    [],
  )

  function updateField(key, value) {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  async function goToStep(target, validate = false) {
    if (validate && !runValidation(step)) return
    if (validate && step === 1) {
      const validGhp = await validateOptionalGhpControlNo()
      if (!validGhp) return
    }
    setStep(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function runValidation(currentStep) {
    const requiredByStep = {
      1: ['firstname','lastname','email','contact','address','province'],
      2: ['applicationType','ownerName','plate','vtype','vmake','vmodel','vyear','capacity','meatEstablishment','intendedRoute'],
      3: [],
    }
    const missing = (requiredByStep[currentStep] || []).filter(k => !formData[k]?.trim())
    if (missing.length) { showToast('Please fill in all required fields.', true); return false }
    if (currentStep === 3) {
      const missingDocs = REQUIRED_DOCS.filter(doc => doc.required && !files[doc.id])
      if (missingDocs.length) {
        showToast('Please upload all required documents.', true)
        return false
      }
    }
    if (currentStep === 3 && !agree) { showToast('Please agree to the certification.', true); return false }
    return true
  }

  async function validateOptionalGhpControlNo() {
    const controlNo = formData.ghpCertNumber?.trim()
    if (!controlNo) return true

    setValidatingGhp(true)
    try {
      const res = await fetch(`/api/ghp/certificate?id=${encodeURIComponent(controlNo)}`, {
        cache: 'no-store',
      })
      const json = await res.json()

      if (!res.ok || !json.success || json.certificate?.isExpired) {
        showToast('The GHP certificate control number is not valid. Leave it blank or enter a valid control number.', true)
        return false
      }

      return true
    } catch {
      showToast('Unable to validate the GHP certificate control number. Please try again or leave it blank.', true)
      return false
    } finally {
      setValidatingGhp(false)
    }
  }

  async function handleSubmit() {
    if (submitting) return
    const validGhp = await validateOptionalGhpControlNo()
    if (!validGhp) return
    setSubmitting(true)
    startTransition(() => setOptimisticMessage('Securing your application and uploading documents...'))
    try {
      const payload = new FormData()
      payload.append('submissionId', submissionId)
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value ?? '')
      })
      Object.entries(files).forEach(([docId, file]) => {
        payload.append(`document:${docId}`, file, file.name)
      })

      const res  = await fetch('/api/applications', {
        method:  'POST',
        body:    payload,
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      if (!json.emailSent) {
        showToast('Application submitted, but the confirmation email could not be sent. Please keep your reference number.', true)
      }
      setRefNumber(json.refNumber)
      setSubmitted(true)
      localStorage.removeItem(DRAFT_KEY)
    } catch (err) {
      showToast(err.message || 'Submission failed. Please try again.', true)
    } finally {
      setSubmitting(false)
      setOptimisticMessage('')
    }
  }

  function handleReset() {
    setStep(1)
    setFormData(INITIAL_FORM)
    setFiles({})
    setAgree(false)
    setSubmitted(false)
    setRefNumber('')
    localStorage.removeItem(DRAFT_KEY)
  }

  if (submitted) {
    return <SuccessView refNumber={refNumber} onReset={handleReset} />
  }

  return (
    <>
      <div className={styles.container}>
        <FormProgress currentStep={step} />
        {optimisticMessage && (
          <div className={styles.optimistic} role="status" aria-live="polite">
            <span className={styles.optimisticSpinner} />
            <div>
              <strong>Application is being submitted</strong>
              <p>{optimisticMessage}</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <Step1Applicant
            data={formData}
            onChange={updateField}
            onNext={() => goToStep(2, true)}
            validatingGhp={validatingGhp}
          />
        )}
        {step === 2 && (
          <Step2Vehicle
            data={formData}
            onChange={updateField}
            onBack={() => goToStep(1)}
            onNext={() => goToStep(3, true)}
          />
        )}
        {step === 3 && (
          <Step3Documents
            files={files}
            setFiles={setFiles}
            agree={agree}
            setAgree={setAgree}
            onBack={() => goToStep(2)}
            onNext={() => goToStep(4, true)}
            showToast={showToast}
          />
        )}
        {step === 4 && (
          <Step4Review
            data={formData}
            files={files}
            submitting={submitting}
            onBack={() => goToStep(3)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
      <Toast {...toastState} />
    </>
  )
}
