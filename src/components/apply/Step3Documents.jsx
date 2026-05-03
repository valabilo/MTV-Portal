'use client'
/**
 * components/apply/Step3Documents.jsx
 *
 * Props:
 *   files     {{ [docId]: File }}
 *   setFiles  {Function}
 *   agree     {boolean}
 *   setAgree  {Function}
 *   onBack    {()=>void}
 *   onNext    {()=>void}
 *   showToast {Function}
 */

import { REQUIRED_DOCS } from '@/data/requiredDocs'
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/lib/constants'
import { formatBytes } from '@/lib/utils'
import styles from './FormSteps.module.css'
import docStyles from './Step3Documents.module.css'

export default function Step3Documents({ files, setFiles, agree, setAgree, onBack, onNext, showToast }) {

  function addFile(docId, file) {
    if (file.size > MAX_FILE_SIZE) {
      showToast(`File too large. Maximum size is 5 MB.`, true)
      return
    }
    setFiles(prev => ({ ...prev, [docId]: file }))
  }

  function removeFile(docId) {
    setFiles(prev => {
      const next = { ...prev }
      delete next[docId]
      return next
    })
  }

  function handleDrop(e, docId) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) addFile(docId, file)
  }

  return (
    <div className={styles.body}>
      <h2 className={styles.sectionTitle}>📂 Documentary Requirements</h2>
      <p className={docStyles.intro}>
        Upload scanned copies or clear photos of the following documents.
        Accepted formats: PDF, JPG, PNG. Maximum file size per document: 5 MB.
      </p>

      {/* Upload fields */}
      <div className={docStyles.docList}>
        {REQUIRED_DOCS.map(doc => (
          <div key={doc.id} className={docStyles.docItem}>
            <label className={docStyles.docLabel}>
              {doc.label} <span className="req">*</span>
            </label>

            {/* Drop zone */}
            {!files[doc.id] ? (
              <div
                className={docStyles.dropZone}
                onClick={() => document.getElementById(`file_${doc.id}`).click()}
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add(docStyles.dragOver) }}
                onDragLeave={e => e.currentTarget.classList.remove(docStyles.dragOver)}
                onDrop={e => { e.currentTarget.classList.remove(docStyles.dragOver); handleDrop(e, doc.id) }}
                role="button"
                tabIndex={0}
                aria-label={`Upload ${doc.label}`}
                onKeyDown={e => e.key === 'Enter' && document.getElementById(`file_${doc.id}`).click()}
              >
                <span className={docStyles.dropIcon}>📎</span>
                <p>Click to upload or drag &amp; drop</p>
                <p className={docStyles.dropHint}>PDF, JPG, PNG – max 5 MB</p>
              </div>
            ) : (
              <div className={docStyles.fileItem}>
                <span>📄 {files[doc.id].name} ({formatBytes(files[doc.id].size)})</span>
                <button
                  type="button"
                  onClick={() => removeFile(doc.id)}
                  aria-label={`Remove ${doc.label}`}
                  className={docStyles.removeBtn}
                >✕</button>
              </div>
            )}

            <input
              type="file"
              id={`file_${doc.id}`}
              accept={ACCEPTED_FILE_TYPES}
              style={{ display: 'none' }}
              onChange={e => { if (e.target.files[0]) addFile(doc.id, e.target.files[0]) }}
            />
          </div>
        ))}
      </div>

      {/* Certification */}
      <h2 className={styles.sectionTitle} style={{ marginTop: 28 }}>📝 Certification</h2>
      <div className={docStyles.certBox}>
        I hereby certify that all information and documents submitted are true, accurate and complete.
        I understand that any misrepresentation may result in the cancellation of my application and/or accreditation.
      </div>
      <label className={docStyles.agreeLabel}>
        <input
          type="checkbox"
          checked={agree}
          onChange={e => setAgree(e.target.checked)}
          style={{ width: 18, height: 18, accentColor: 'var(--green)' }}
        />
        I agree to the terms and certification above. <span className="req">*</span>
      </label>

      <div className="form-footer">
        <button className="btn btn-outline" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext}>Next: Review →</button>
      </div>
    </div>
  )
}
