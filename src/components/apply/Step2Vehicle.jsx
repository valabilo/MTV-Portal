'use client'
/**
 * components/apply/Step2Vehicle.jsx
 */

import styles from './FormSteps.module.css'

const VEHICLE_TYPES = [
  'Refrigerated Truck','Insulated Truck','Open Truck with Cover',
  'Closed Van','Refrigerated Van','Motorcycle with Insulated Box',
]
const MATERIALS    = ['Stainless Steel','Fiberglass','Aluminum','Polyurethane Foam']
const BUSINESS_TYPES = ['Sole Proprietorship','Partnership','Corporation','Cooperative']

export default function Step2Vehicle({ data, onChange, onBack, onNext }) {
  const f = (id, type = 'text') => ({
    id,
    type,
    value:    data[id] ?? '',
    onChange: (e) => onChange(id, e.target.value),
  })

  return (
    <div className={styles.body}>
      {/* Vehicle */}
      <h2 className={styles.sectionTitle}>🚛 Vehicle Information</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="plate">Plate Number <span className="req">*</span></label>
          <input placeholder="ABC 1234" style={{ textTransform: 'uppercase' }} {...f('plate')} />
        </div>
        <div className="form-group">
          <label htmlFor="vtype">Vehicle Type <span className="req">*</span></label>
          <select id="vtype" value={data.vtype} onChange={e => onChange('vtype', e.target.value)}>
            <option value="">-- Select Type --</option>
            {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="vmake">Make / Brand <span className="req">*</span></label>
          <input placeholder="e.g. Isuzu, Mitsubishi" {...f('vmake')} />
        </div>
        <div className="form-group">
          <label htmlFor="vmodel">Model <span className="req">*</span></label>
          <input placeholder="e.g. Elf, Canter" {...f('vmodel')} />
        </div>
        <div className="form-group">
          <label htmlFor="vyear">Year <span className="req">*</span></label>
          <input type="number" placeholder="2020" min="1990" max="2030" {...f('vyear','number')} />
        </div>
        <div className="form-group">
          <label htmlFor="vcolor">Color</label>
          <input placeholder="White" {...f('vcolor')} />
        </div>
        <div className="form-group">
          <label htmlFor="vengine">Engine Number</label>
          <input placeholder="Engine number" {...f('vengine')} />
        </div>
        <div className="form-group">
          <label htmlFor="vchassis">Chassis Number</label>
          <input placeholder="Chassis number" {...f('vchassis')} />
        </div>
      </div>

      {/* Cargo Compartment */}
      <h2 className={styles.sectionTitle} style={{ marginTop: 8 }}>🌡️ Cargo Compartment</h2>
      <div className="form-grid-3">
        <div className="form-group">
          <label htmlFor="cooling">Cooling Capacity (°C)</label>
          <input placeholder="e.g. 0°C to -18°C" {...f('cooling')} />
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Load Capacity (kg) <span className="req">*</span></label>
          <input type="number" placeholder="500" {...f('capacity','number')} />
        </div>
        <div className="form-group">
          <label htmlFor="material">Compartment Material</label>
          <select id="material" value={data.material} onChange={e => onChange('material', e.target.value)}>
            <option value="">-- Select --</option>
            {MATERIALS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Business */}
      <h2 className={styles.sectionTitle} style={{ marginTop: 8 }}>🏢 Business Information</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="bname">Business Name <span className="req">*</span></label>
          <input placeholder="Dela Cruz Meat Trader" {...f('bname')} />
        </div>
        <div className="form-group">
          <label htmlFor="btype">Business Type <span className="req">*</span></label>
          <select id="btype" value={data.btype} onChange={e => onChange('btype', e.target.value)}>
            <option value="">-- Select --</option>
            {BUSINESS_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group full">
          <label htmlFor="baddress">Business Address <span className="req">*</span></label>
          <input placeholder="Complete business address" {...f('baddress')} />
        </div>
      </div>

      <div className="form-footer">
        <button className="btn btn-outline" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext}>Next: Documents →</button>
      </div>
    </div>
  )
}
