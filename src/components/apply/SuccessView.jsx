import styles from "./SuccessView.module.css";

export default function SuccessView({ refNumber, onReset, isAmendment = false }) {
  return (
    <div className={styles.card}>
      <h2>{isAmendment ? "Amendment Submitted" : "Application Submitted"}</h2>
      <p>
        {isAmendment
          ? "Your MTV accreditation amendment has been successfully submitted."
          : "Your MTV accreditation application has been successfully submitted."}
        Please keep your reference number for tracking purposes.
      </p>

      <div className={styles.refBox}>
        <p>Reference Number</p>
        <span>{refNumber}</span>
      </div>

      <p className={styles.note}>
        You will receive a confirmation email within 24 hours. Our team will
        review your application and notify you of any updates.
      </p>

      <div className={styles.actions}>
        <a
          href={`/application-status?ref=${encodeURIComponent(refNumber)}`}
          className="btn btn-primary">
          Track Status
        </a>
        <button className="btn btn-outline" onClick={onReset}>
          {isAmendment ? "Submit Another Application" : "Submit Another"}
        </button>
      </div>
    </div>
  );
}
