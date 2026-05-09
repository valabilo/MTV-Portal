import styles from "./guidelines.module.css";
import ZoomableFigure from "./ZoomableFigure";
import { getReferenceIssuances } from "@/lib/googleSheets";

export const metadata = {
  title: "MTV Guidelines - MTV Portal",
};

const GUIDELINE_ITEMS = [
  {
    icon: "/images/icons/vehicle-safe.png",
    title: "Dedicated Use",
    content:
      "The Meat Transport Vehicle shall be used exclusively for the transport of meat to prevent cross-contamination from previous cargoes.",
  },
  {
    icon: "/images/icons/certificate.png",
    title: "Annual Validity",
    content:
      "The Certificate of Registration and official sticker remain valid for one (1) year from issuance unless sooner cancelled or revoked.",
  },
  {
    icon: "/images/icons/no-transfer.png",
    title: "Vehicle-Specific Registration",
    content:
      "The registration is non-transferable and applies only to the registered vehicle.",
  },
];

const QUICK_LINKS = [
  { href: "#general", label: "General Rules" },
  { href: "#markings", label: "Markings" },
  { href: "#curtains", label: "Plastic Curtains" },
  { href: "#photos", label: "Vehicle Photos" },
  { href: "#issuances", label: "References" },
];

const DISPLAY_RULES = [
  "For new applications, the assigned registration number must be displayed within one (1) month upon issuance of the COR.",
  "For renewal, the MTV shall be given a grace period to update the registration number.",
  "During the 30-day grace period, operations may continue while compliance is ongoing.",
  "Proof of compliance must be submitted to the RTOC office or NMIS personnel.",
];

const VEHICLE_PHOTOS = [
  {
    src: "/images/vehicle-photos/01-front-view.jpg",
    title: "Front View",
    note: "Plate number must be visible.",
  },
  {
    src: "/images/vehicle-photos/02-closed-back-view.jpg",
    title: "Closed Back View",
    note: "Show rear door condition and plate number.",
  },
  {
    src: "/images/vehicle-photos/03-opened-back-view.jpg",
    title: "Opened Back View",
    note: "Show cargo opening and rear access.",
  },
  {
    src: "/images/vehicle-photos/04-inside-view.jpg",
    title: "Inside View",
    note: "Cargo compartment must be clear and readable.",
  },
  {
    src: "/images/vehicle-photos/05-left-side-view.jpg",
    title: "Left Side View",
    note: "Capture the full side profile.",
  },
  {
    src: "/images/vehicle-photos/06-right-side-view.jpg",
    title: "Right Side View",
    note: "Capture the full side profile.",
  },
];

export const dynamic = "force-dynamic";

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className={styles.sectionHeading}>
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function firstValue(row, keys) {
  for (const key of keys) {
    const value = row[key];
    if (value) return value;
  }

  return "";
}

function groupReferenceIssuances(rows) {
  const groups = new Map();

  rows.forEach((row) => {
    const groupTitle =
      firstValue(row, ["group", "category", "type", "issuance_type"]) ||
      "Reference Issuances";
    const number = firstValue(row, [
      "number",
      "memorandum_number",
      "issuance_number",
      "reference",
      "title",
    ]);
    const detail = firstValue(row, [
      "detail",
      "details",
      "description",
      "subject",
      "particulars",
    ]);
    const url = firstValue(row, ["url", "link", "file_url", "drive_url"]);

    if (!number && !detail) return;

    if (!groups.has(groupTitle)) {
      groups.set(groupTitle, { title: groupTitle, items: [] });
    }

    groups.get(groupTitle).items.push({
      number: number || detail,
      detail,
      url,
    });
  });

  return Array.from(groups.values()).filter((group) => group.items.length);
}

async function getMemoGroups() {
  try {
    const rows = await getReferenceIssuances();
    return groupReferenceIssuances(rows);
  } catch (error) {
    console.error("Reference issuances fetch error:", error);
    return [];
  }
}

export default async function GuidelinesPage() {
  const memorandumGroups = await getMemoGroups();

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>MTV Guidelines</h1>
          <p>Registration, marking, compliance, and vehicle photo guidance.</p>
        </div>
      </div>

      <main className={styles.page}>
        <div className="container">
          <section className={styles.overview}>
            <div className={styles.overviewCopy}>
              <span className={styles.kicker}>Operational Guide</span>
              <h2>Keep MTV registration, markings, and inspection photos aligned with NMIS requirements.</h2>
              <p>
                Use this page as a practical reference before submitting an MTV
                application or compliance update. It summarizes the core vehicle
                use rules, required markings, photo standards, and related
                issuances.
              </p>
            </div>
            <div className={styles.summaryGrid}>
              <div>
                <span>Validity</span>
                <strong>1 year</strong>
              </div>
              <div>
                <span>Registration</span>
                <strong>Per vehicle</strong>
              </div>
              <div>
                <span>Use</span>
                <strong>Meat transport only</strong>
              </div>
            </div>
          </section>

          <nav className={styles.quickNav} aria-label="Guidelines sections">
            {QUICK_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <section className={styles.band} id="general">
            <SectionHeading
              eyebrow="General Guidelines"
              title="Core MTV operating rules"
              text="These rules help preserve meat safety, traceability, and vehicle accountability during transport."
            />
            <div className={styles.guidelineGrid}>
              {GUIDELINE_ITEMS.map((item) => (
                <article key={item.title} className={styles.guidelineCard}>
                  <img src={item.icon} alt="" aria-hidden="true" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.band} id="markings">
            <SectionHeading
              eyebrow="MTV Markings"
              title="Registration number and compliance"
              text="Registered Meat Transport Vehicles must display the assigned number using the prescribed format for monitoring and identification."
            />
            <div className={styles.complianceLayout}>
              <ZoomableFigure
                figureClassName={styles.featureImage}
                src="/images/vehicle-photos/mtv-format.png"
                alt="Example of MTV registration number format"
              />
              <div className={styles.compliancePanel}>
                <div className={styles.formatBlock}>
                  <span>Prescribed format</span>
                  <strong>NMIS-III-0001</strong>
                </div>
                <div className={styles.checklist}>
                  <div>
                    <span>01</span>
                    <p>Each MTV shall be assigned a unique registration number.</p>
                  </div>
                  <div>
                    <span>02</span>
                    <p>The assigned number serves as the permanent identification of the vehicle.</p>
                  </div>
                  <div>
                    <span>03</span>
                    <p>Operators must display the registration number following the prescribed format.</p>
                  </div>
                </div>
                <a
                  className={`btn btn-primary ${styles.complianceButton}`}
                  href="https://docs.google.com/forms/d/e/1FAIpQLScwXOm0nb0k8pgOjUDRiyO0IIVPjLRKSDDGgFMaXPzYA6TgTw/viewform"
                  target="_blank"
                  rel="noreferrer">
                  Submit Compliance
                </a>
              </div>
            </div>

            <div className={styles.ruleStrip}>
              {DISPLAY_RULES.map((rule, index) => (
                <article key={rule}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{rule}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.band} id="curtains">
            <SectionHeading
              eyebrow="Plastic Curtains"
              title="Rear opening and overlap requirements"
              text="Industrial plastic curtain or PVC strip plastic curtain must properly overlap and be placed near the rear opening, with curtain-to-floor distance kept close to 1 cm."
            />
            <div className={styles.mediaGridTwo}>
              <ZoomableFigure
                figureClassName={styles.photoFigure}
                src="/images/curtain-photos/curtain-1.png"
                alt="PVC curtain overlapping detail">
                <figcaption>PVC curtain overlapping detail</figcaption>
              </ZoomableFigure>
              <ZoomableFigure
                figureClassName={styles.photoFigure}
                src="/images/curtain-photos/curtain-2.png"
                alt="Rear curtain placement">
                <figcaption>Rear curtain placement</figcaption>
              </ZoomableFigure>
            </div>
          </section>

          <section className={styles.band} id="photos">
            <SectionHeading
              eyebrow="Vehicle Photos"
              title="Required photo angles for MTV applications"
              text="Upload clear photos that show the vehicle identity, plate number where required, and the cargo compartment condition."
            />
            <div className={styles.photoGrid}>
              {VEHICLE_PHOTOS.map((photo) => (
                <ZoomableFigure
                  key={photo.title}
                  figureClassName={styles.photoFigure}
                  src={photo.src}
                  alt={photo.title}>
                  <figcaption>
                    <strong>{photo.title}</strong>
                    <span>{photo.note}</span>
                  </figcaption>
                </ZoomableFigure>
              ))}
            </div>
          </section>

          <section className={styles.band} id="issuances">
            <SectionHeading
              eyebrow="Reference Issuances"
              title="Policy references and related memoranda"
              text="Open each group to review the issuances supporting MTV registration, numbering, marking, and certificate policies."
            />
            {memorandumGroups.length ? (
              <div className={styles.memoGroups}>
                {memorandumGroups.map((group) => (
                  <details key={group.title} className={styles.memoGroup}>
                    <summary>{group.title}</summary>
                    <div className={styles.memoItems}>
                      {group.items.map((item) => (
                        <article key={item.number} className={styles.memoItem}>
                          <h3>
                            {item.url ? (
                              <a href={item.url} target="_blank" rel="noreferrer">
                                {item.number}
                              </a>
                            ) : (
                              item.number
                            )}
                          </h3>
                          <p>{item.detail}</p>
                        </article>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>
                No reference issuances are available from the Google Sheet.
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
