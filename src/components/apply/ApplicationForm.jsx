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

import { useState } from 'react'
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

const INITIAL_FORM = {
  firstname: '', lastname: '', middlename: '', suffix: '',
  email: '', contact: '', address: '', region: 'III', province: '',
  plate: '', vtype: '', vmake: '', vmodel: '', vyear: '', vcolor: '',
  vengine: '', vchassis: '', cooling: '', capacity: '', material: '',
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

  const { toastState, showToast } = useToast()

  function updateField(key, value) {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  function goToStep(target, validate = false) {
    if (validate && !runValidation(step)) return
    setStep(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function runValidation(currentStep) {
    const requiredByStep = {
      1: ['firstname','lastname','email','contact','address','province','ghpCertNumber'],
      2: ['plate','vtype','vmake','vmodel','vyear','capacity','bname','btype','baddress'],
      3: [],
    }
    const missing = (requiredByStep[currentStep] || []).filter(k => !formData[k]?.trim())
    if (missing.length) { showToast('Please fill in all required fields.', true); return false }
    if (currentStep === 3) {
      const missingDocs = REQUIRED_DOCS.filter(doc => !files[doc.id])
      if (missingDocs.length) {
        showToast('Please upload all required documents, including the GHP certificate.', true)
        return false
      }
    }
    if (currentStep === 3 && !agree) { showToast('Please agree to the certification.', true); return false }
    return true
  }

  /**
   * Converts all uploaded File objects to base64 strings so they can be
   * sent as JSON to the API route, which forwards them to Google Drive.
   */
  async function filesToBase64(filesMap) {
    const result = {}
    for (const [docId, file] of Object.entries(filesMap)) {
      result[docId] = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload  = () => resolve({
          base64: reader.result,          // "data:application/pdf;base64,..."
          name:   file.name,
          mime:   file.type,
        })
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    }
    return result
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      // Convert files to base64 for transport
      const documents = Object.keys(files).length > 0
        ? await filesToBase64(files)
        : {}

      const res  = await fetch('/api/applications', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...formData, documents }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setRefNumber(json.refNumber)
      setSubmitted(true)
    } catch (err) {
      showToast(err.message || 'Submission failed. Please try again.', true)
    } finally {
      setSubmitting(false)
    }
  }

  function handleReset() {
    setStep(1)
    setFormData(INITIAL_FORM)
    setFiles({})
    setAgree(false)
    setSubmitted(false)
    setRefNumber('')
  }

  if (submitted) {
    return <SuccessView refNumber={refNumber} onReset={handleReset} />
  }

  return (
    <>
      <div className={styles.container}>
        <FormProgress currentStep={step} />

        {step === 1 && (
          <Step1Applicant
            data={formData}
            onChange={updateField}
            onNext={() => goToStep(2, true)}
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
