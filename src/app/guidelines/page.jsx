import styles from './guidelines.module.css'

export const metadata = {
  title: 'MTV Guidelines - MTV Portal',
}

const MEMORANDUM_GROUPS = [
  {
    title: 'Memorandum Circular',
    items: [
      {
        number: 'Memorandum Circular No. 06-2024-19',
        detail: 'Numbering of Registered MTV',
      },
      {
        number: 'Memorandum Circular No. 10-2020-021',
        detail: 'Granting of Six (6) months transition period to conform with the use of chiller/reefer vans to be registered as NMIS Meat Transport Vehicle (MTV) effective up to March 2021',
      },
      {
        number: 'Memorandum Circular No. 02-2017-002',
        detail: 'Accreditation / Registration of Meat Transport Vehicle (MTV)',
      },
      {
        number: 'Memorandum Circular No. 12-2015-016',
        detail: 'Implementation of "No meat transport vehicle (MTV) accreditation" No Loading/Unloading Transport Policy',
      },
      {
        number: '1987 Memorandum Circular 001-87',
        detail: 'Guidelines on the Use of Meat Inspection Certificates and Accredited Meat Vans',
      },
    ],
  },
  {
    title: 'Memorandum',
    items: [
      {
        number: 'Memorandum No. 12-03-2015-16',
        detail: 'Painting of MTV Accreditation Number',
      },
      {
        number: 'Memorandum No. 0941',
        detail: 'Adoption of unified certificate of accreditation of meat transport vehicle (MTV)',
      },
    ],
  },
  {
    title: 'Memorandum Order',
    items: [
      {
        number: 'Memorandum Order No. 05-2025-260',
        detail: 'Revised Guidelines on the Numbering System for Meat Transport Vehicle (MTV) Registration',
      },
      {
        number: 'Memorandum Order No. CO-07-2024-493',
        detail: 'Reiterating the Implementation on Registering Meat Transport Vehicle for Meat Processed Products',
      },
      {
        number: 'Memorandum Order No. CO-07-2024-454',
        detail: 'Updated Policy on Signatory for NMIS MTV Certificate of Registration and Delineation of Responsibility for the Issuance of NMIS MTV Certificate of Registration (MTV COR)',
      },
    ],
  },
]

export default function GuidelinesPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-eyebrow">Policy & Compliance</div>
          <h1>MTV Guidelines</h1>
          <p>Registration, marking, compliance, and vehicle photo guidance.</p>
        </div>
      </div>

      <main className={styles.page}>
        <div className="container">
          <section className={styles.section}>
            <h2>General Guidelines</h2>
            <div className={styles.grid}>
              <ul className={styles.list}>
                <li>The Meat Transport Vehicle shall be used exclusively for the transport of meat to prevent cross-contamination from previous cargoes.</li>
                <li>The Certificate of Registration and official sticker remain valid for one (1) year from issuance unless sooner cancelled or revoked.</li>
                <li>The registration is non-transferable and applies only to the registered vehicle.</li>
              </ul>
              <div className={styles.vehicleMock}>
                <div className={styles.registered}>Registered</div>
                <p>Display the registration sticker and keep the COR available during transport.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>MTV Markings and Compliance</h2>
            <p>
              Registered Meat Transport Vehicles must comply with prescribed registration numbering and marking requirements for identification, traceability, and monitoring.
            </p>
            <div className={styles.format}>NMIS-III-0001</div>
            <ul className={styles.list}>
              <li>Each MTV shall be assigned a unique registration number.</li>
              <li>The assigned number serves as the permanent identification of the vehicle.</li>
              <li>Operators must display the registration number following the prescribed format.</li>
            </ul>
            <a
              className="btn btn-primary btn-sm"
              href="https://docs.google.com/forms/d/e/1FAIpQLScwXOm0nb0k8pgOjUDRiyO0IIVPjLRKSDDGgFMaXPzYA6TgTw/viewform"
              target="_blank"
              rel="noreferrer"
              style={{ marginTop: 16 }}
            >
              Submit Compliance
            </a>
          </section>

          <section className={styles.section}>
            <h2>Display of Registration Number</h2>
            <ul className={styles.list}>
              <li>For new applications, the assigned registration number must be displayed within one (1) month upon issuance of the COR.</li>
              <li>For renewal, the MTV shall be given a grace period to update the registration number.</li>
              <li>During the 30-day grace period, operations may continue while compliance is ongoing.</li>
              <li>Proof of compliance must be submitted to the RTOC office or NMIS personnel.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Plastic Curtains and Vehicle Photos</h2>
            <p>
              Industrial plastic curtain or PVC strip plastic curtain must properly overlap and be placed near the rear opening, with curtain-to-floor distance kept close to 1 cm.
            </p>
            <div className={styles.photoGrid}>
              <div className={styles.photoBox}>Front view with visible plate number</div>
              <div className={styles.photoBox}>Closed back view with visible plate number</div>
              <div className={styles.photoBox}>Opened back view with visible plate number</div>
              <div className={styles.photoBox}>Inside view with visible plate number</div>
              <div className={styles.photoBox}>Left side view</div>
              <div className={styles.photoBox}>Right side view</div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Reference Issuances</h2>
            <div className={styles.memoGroups}>
              {MEMORANDUM_GROUPS.map((group) => (
                <details key={group.title} className={styles.memoGroup}>
                  <summary>{group.title}</summary>
                  <div className={styles.memoItems}>
                    {group.items.map((item) => (
                      <details key={item.number} className={styles.memoItem}>
                        <summary>{item.number}</summary>
                        <p>{item.detail}</p>
                      </details>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
