'use client'
/**
 * app/banned/page.jsx  –  Banned MTV Page (/banned)
 */

import { useMTVData } from '@/hooks/useMTVData'
import DataTable      from '@/components/ui/DataTable'
import StatusTag      from '@/components/ui/StatusTag'
import styles         from './banned.module.css'

export default function BannedPage() {
  const { data, loading, error } = useMTVData('banned')

  const columns = [
    { key: 'plate',    label: 'Plate No.',   render: v => <strong>{v}</strong> },
    { key: 'business', label: 'Business Name' },
    { key: 'owner',    label: 'Owner'         },
    { key: 'reason',   label: 'Reason'        },
    { key: 'date',     label: 'Date Banned'   },
    { key: 'status',   label: 'Status',       render: v => <StatusTag status={v || 'Banned'} /> },
  ]

  return (
    <>
      <div className={styles.hero}>
        <div className="container">
          <div className="page-hero-eyebrow">Enforcement</div>
          <h1>Banned / Suspended MTV List</h1>
          <p>Vehicles that have been banned, suspended, or revoked from operation.</p>
        </div>
      </div>

      <div style={{ padding: '40px 0' }}>
        <div className="container">
          {/* Warning notice */}
          <div className={styles.warning}>
            <span className={styles.warningIcon}>⚠️</span>
            <div>
              <strong>Warning Notice</strong>
              <p>
                Transacting with banned or suspended MTVs is a violation of meat safety
                regulations. Report any suspicious activity to NMIS immediately.
              </p>
            </div>
          </div>

          <DataTable
            title="Banned MTV Records"
            columns={columns}
            data={data}
            loading={loading}
            emptyText="No banned vehicles found."
          />
          {error && (
            <div className="form-error" style={{ marginTop: 16 }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
