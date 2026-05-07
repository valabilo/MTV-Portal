"use client";
/**
 * components/apply/ApplicationForm.jsx
 *
 * Orchestrates the 4-step MTV application form.
 *
 * UPLOAD STRATEGY — solves both problems:
 *   Problem 1: Vercel 4.5 MB payload limit  → solved by chunking (4 MB per chunk)
 *   Problem 2: CORS blocks browser→Google   → solved by proxying through our API
 *
 * Flow per file:
 *   1. POST /api/drive/create-folder  → folderId
 *   2. POST /api/drive/init-upload    → resumable uploadUrl (server creates session)
 *   3. For each 4 MB chunk:
 *        POST /api/drive/upload-chunk  → chunk forwarded server→Google (no CORS)
 *   4. POST /api/applications         → JSON metadata only (tiny, no files)
 */

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useToast } from "@/hooks/useToast";
import { REQUIRED_DOCS } from "@/data/requiredDocs";
import Toast from "@/components/ui/Toast";
import FormProgress from "./FormProgress";
import Step1Applicant from "./Step1Applicant";
import Step2Vehicle from "./Step2Vehicle";
import Step3Documents from "./Step3Documents";
import Step4Review from "./Step4Review";
import SuccessView from "./SuccessView";
import styles from "./ApplicationForm.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────
const CHUNK_SIZE = 4 * 1024 * 1024; // 4 MB — safely under Vercel's 4.5 MB limit

const INITIAL_FORM = {
  applicationType: "New",
  registeredOwner: "",
  email: "",
  contact: "",
  address: "",
  region: "III",
  province: "",
  plate: "",
  vtype: "",
  vmake: "",
  vmodel: "",
  vyear: "",
  vcolor: "",
  vengine: "",
  vchassis: "",
  crNumber: "",
  orNumber: "",
  ltoClientId: "",
  bodyType: "",
  fuelType: "",
  cooling: "",
  capacity: "",
  grossWeight: "",
  netCapacity: "",
  material: "",
  meatEstablishment: "",
  intendedRoute: "",
  bname: "",
  btype: "",
  baddress: "",
  ghpCertNumber: "",
};

const DRAFT_STORAGE_KEY = "mtv-application-draft-v1";

// ─── Draft helpers ────────────────────────────────────────────────────────────
function normalizeDraftForm(savedForm) {
  if (!savedForm || typeof savedForm !== "object") return INITIAL_FORM;
  return Object.keys(INITIAL_FORM).reduce((draft, key) => {
    draft[key] =
      typeof savedForm[key] === "string" ? savedForm[key] : INITIAL_FORM[key];
    return draft;
  }, {});
}

function getSavedDraft() {
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    const savedStep = Math.min(Math.max(Number(draft.step) || 1, 1), 4);
    return {
      formData: normalizeDraftForm(draft.formData),
      step: savedStep === 4 ? 3 : savedStep,
      agree: Boolean(draft.agree),
    };
  } catch {
    return null;
  }
}

function clearSavedDraft() {
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ─── Chunked upload helpers ───────────────────────────────────────────────────

/**
 * Step 1: Ask our API to create a resumable upload session with Google Drive.
 * Returns the uploadUrl (opaque session URL from Google).
 */
async function initUpload({ fileName, mimeType, folderId, fileSize }) {
  const res = await fetch("/api/drive/init-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, mimeType, folderId, fileSize }),
  });
  const json = await res.json();
  if (!json.success)
    throw new Error(json.error || "Failed to initialise upload");
  return json.uploadUrl;
}

/**
 * Step 2: Send one chunk to our proxy route.
 * Our server then forwards it to Google (no CORS issue).
 */
async function sendChunk({
  uploadUrl,
  chunk,
  rangeStart,
  rangeEnd,
  totalSize,
  isLast,
}) {
  const form = new FormData();
  form.append("uploadUrl", uploadUrl);
  form.append("chunk", chunk); // Blob
  form.append("rangeStart", String(rangeStart));
  form.append("rangeEnd", String(rangeEnd));
  form.append("totalSize", String(totalSize));
  form.append("isLast", isLast ? "true" : "false");

  const res = await fetch("/api/drive/upload-chunk", {
    method: "POST",
    body: form,
    // No Content-Type header — browser sets multipart boundary automatically
  });

  const json = await res.json();
  if (!json.success) throw new Error(json.error || `Chunk upload failed`);
  return json; // { done, fileId? }
}

/**
 * Full chunked upload for one file.
 * Splits the file into CHUNK_SIZE pieces and uploads each through our proxy.
 */
async function uploadFileInChunks({
  file,
  folderId,
  refPrefix,
  docId,
  onProgress,
}) {
  const totalSize = file.size;
  const fileName = `${refPrefix}_${docId}_${file.name}`
    .replace(/[\\/:*?"<>|]/g, "-")
    .slice(0, 200);

  // 1. Initialise the resumable session
  const uploadUrl = await initUpload({
    fileName,
    mimeType: file.type || "application/octet-stream",
    folderId,
    fileSize: totalSize,
  });

  let offset = 0;
  let fileId = null;

  // 2. Send chunks one by one
  while (offset < totalSize) {
    const end = Math.min(offset + CHUNK_SIZE, totalSize);
    const chunk = file.slice(offset, end); // Blob slice — no memory copy
    const isLast = end === totalSize;

    const result = await sendChunk({
      uploadUrl,
      chunk,
      rangeStart: offset,
      rangeEnd: end - 1, // Google range is inclusive
      totalSize,
      isLast,
    });

    offset = end;
    if (onProgress) onProgress(Math.round((offset / totalSize) * 100));

    if (result.done) {
      fileId = result.fileId;
      break;
    }
  }

  return { docId, fileName, size: totalSize, fileId };
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ApplicationForm() {
  const formRef = useRef(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [files, setFiles] = useState({});
  const [agree, setAgree] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validatingGhp, setValidatingGhp] = useState(false);
  const [optimisticMessage, setOptimisticMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState({}); // docId → 0-100
  const [draftReady, setDraftReady] = useState(false);
  const [, startTransition] = useTransition();

  const { toastState, showToast } = useToast();

  const submissionId = useMemo(
    () =>
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    [],
  );

  // Load draft
  useEffect(() => {
    const draft = getSavedDraft();
    if (draft) {
      setFormData(draft.formData);
      setStep(draft.step);
      setAgree(draft.agree);
    }
    setDraftReady(true);
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (!draftReady || submitted) return;
    const t = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({
            formData,
            step,
            agree,
            savedAt: new Date().toISOString(),
          }),
        );
      } catch {
        /* ignore */
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [agree, draftReady, formData, step, submitted]);

  function updateField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function goToStep(target, validate = false) {
    if (validate && !runValidation(step)) return;
    if (validate && step === 1) {
      const ok = await validateOptionalGhpControlNo();
      if (!ok) return;
    }
    setStep(target);
    requestAnimationFrame(() => {
      const top = formRef.current?.getBoundingClientRect().top + window.scrollY;
      if (top)
        window.scrollTo({ top: Math.max(top - 130, 0), behavior: "smooth" });
    });
  }

  function runValidation(currentStep) {
    const requiredByStep = {
      1: [
        "applicationType",
        "registeredOwner",
        "email",
        "contact",
        "address",
        "region",
        "province",
      ],
      2: [
        "plate",
        "vtype",
        "vmake",
        "vmodel",
        "vyear",
        "capacity",
        "meatEstablishment",
        "intendedRoute",
      ],
      3: [],
    };
    const fieldLabels = {
      registeredOwner: "Registered Owner",
      email: "Email Address",
      contact: "Contact Number",
      address: "Complete Address",
      region: "Region",
      province: "Province",
      applicationType: "Application Type",
      plate: "Plate Number",
      vtype: "Vehicle Type",
      vmake: "Vehicle Make",
      vmodel: "Vehicle Model",
      vyear: "Vehicle Year",
      capacity: "Load Capacity",
      meatEstablishment: "Meat Establishment",
      intendedRoute: "Intended Route",
    };

    const missing = (requiredByStep[currentStep] || []).filter(
      (k) => !formData[k]?.trim(),
    );
    if (missing.length) {
      showToast(
        `Please fill in: ${missing.map((k) => fieldLabels[k] || k).join(", ")}.`,
        true,
      );
      return false;
    }
    if (currentStep === 3) {
      const missingDocs = REQUIRED_DOCS.filter(
        (d) => d.required && !files[d.id],
      );
      if (missingDocs.length) {
        showToast("Please upload all required documents.", true);
        return false;
      }
      if (!agree) {
        showToast("Please agree to the certification.", true);
        return false;
      }
    }
    return true;
  }

  async function validateOptionalGhpControlNo() {
    const controlNo = formData.ghpCertNumber?.trim();
    if (!controlNo) return true;
    setValidatingGhp(true);
    try {
      const res = await fetch(
        `/api/ghp/certificate?id=${encodeURIComponent(controlNo)}`,
        { cache: "no-store" },
      );
      const json = await res.json();
      if (!res.ok || !json.success || json.certificate?.isExpired) {
        showToast(
          "The GHP certificate number is not valid. Leave blank or enter a valid one.",
          true,
        );
        return false;
      }
      return true;
    } catch {
      showToast(
        "Unable to validate GHP certificate. Try again or leave blank.",
        true,
      );
      return false;
    } finally {
      setValidatingGhp(false);
    }
  }

  async function handleSubmit() {
    if (submitting) return;
    const validGhp = await validateOptionalGhpControlNo();
    if (!validGhp) return;

    setSubmitting(true);
    setUploadProgress({});

    try {
      // ── Phase 0: Generate reference number ─────────────────────────────────
      startTransition(() =>
        setOptimisticMessage("Generating your application reference number…"),
      );

      const refRes = await fetch("/api/generate-ref-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const refJson = await refRes.json();
      if (!refJson.success)
        throw new Error(refJson.error || "Failed to generate reference number");
      const generatedRefNumber = refJson.refNumber;

      // ── Phase 1: Create Drive folder ──────────────────────────────────────
      startTransition(() =>
        setOptimisticMessage("Creating your application folder…"),
      );

      const folderName =
        `${generatedRefNumber}_${formData.registeredOwner}_${formData.plate}`
          .replace(/[\\/:*?"<>|]/g, "-")
          .slice(0, 120);

      const folderRes = await fetch("/api/drive/create-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderName }),
      });
      const folderJson = await folderRes.json();
      if (!folderJson.success)
        throw new Error(folderJson.error || "Failed to create Drive folder");
      const folderId = folderJson.folderId;

      // ── Phase 2: Chunked upload for each file (proxied through our API) ───
      const docEntries = Object.entries(files);
      const uploadedFiles = [];

      for (let i = 0; i < docEntries.length; i++) {
        const [docId, file] = docEntries[i];
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        startTransition(() =>
          setOptimisticMessage(
            `Uploading document ${i + 1} of ${docEntries.length}: ${file.name}` +
              (totalChunks > 1 ? ` (${totalChunks} parts)` : "") +
              "…",
          ),
        );

        const result = await uploadFileInChunks({
          file,
          folderId,
          refPrefix: folderName,
          docId,
          onProgress: (pct) =>
            setUploadProgress((prev) => ({ ...prev, [docId]: pct })),
        });

        uploadedFiles.push(result);
      }

      // ── Phase 3: Submit metadata only (no files, no size limit) ──────────
      startTransition(() =>
        setOptimisticMessage("Saving your application record…"),
      );

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          ...formData,
          folderId,
          refNumber: generatedRefNumber,
          uploadedFiles,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      if (!json.emailSent) {
        showToast(
          "Application submitted, but the confirmation email failed. Please save your reference number.",
          true,
        );
      }

      setRefNumber(json.refNumber);
      setSubmitted(true);
      clearSavedDraft();
    } catch (err) {
      showToast(err.message || "Submission failed. Please try again.", true);
    } finally {
      setSubmitting(false);
      setOptimisticMessage("");
      setUploadProgress({});
    }
  }

  function handleReset() {
    setStep(1);
    setFormData(INITIAL_FORM);
    setFiles({});
    setAgree(false);
    setSubmitted(false);
    setRefNumber("");
    clearSavedDraft();
  }

  if (submitted)
    return <SuccessView refNumber={refNumber} onReset={handleReset} />;

  // Calculate weighted overall progress based on file sizes
  const docEntries = Object.entries(files);
  let totalSize = 0;
  let uploadedSize = 0;

  docEntries.forEach(([docId, file]) => {
    const fileSize = file.size || 0;
    const fileProgress = uploadProgress[docId] || 0;
    totalSize += fileSize;
    uploadedSize += (fileSize * fileProgress) / 100;
  });

  const overallProgress =
    totalSize > 0 ? Math.round((uploadedSize / totalSize) * 100) : 0;

  return (
    <>
      <div className={styles.container} ref={formRef}>
        <FormProgress currentStep={step} />

        {optimisticMessage && (
          <div className={styles.optimistic} role="status" aria-live="polite">
            <span className={styles.optimisticSpinner} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>Submitting your application</strong>
              <p>{optimisticMessage}</p>
              {totalSize > 0 && (
                <div className={styles.progressBarWrap}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${overallProgress}%` }}
                  />
                  <span className={styles.progressLabel}>
                    {overallProgress}%
                  </span>
                </div>
              )}
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
  );
}
