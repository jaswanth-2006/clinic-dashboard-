import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { X } from 'lucide-react'

const times = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM']

export default function BookingModal({ doctors, appointments, onClose, onBooked }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ patient_name: '', patient_phone: '', doctor_id: doctors[0]?.id || '', appointment_date: today, appointment_time: '09:00 AM', reason: '', booking_type: 'manual' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function submit() {
    if (!form.patient_name.trim()) { setError('Please enter patient name.'); return }
    const overlap = appointments.find(a => a.doctor_id === form.doctor_id && a.appointment_time === form.appointment_time && a.appointment_date === form.appointment_date)
    if (overlap) { setError(`Slot ${form.appointment_time} is already booked for this doctor. Please choose another time.`); return }
    setSaving(true)
    const { error: err } = await supabase.from('appointments').insert([form])
    setSaving(false)
    if (err) { setError(err.message); return }
    onBooked()
  }

  const inp = { width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: 14, color: 'var(--text)', outline: 'none' }
  const lbl = { fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: 480, maxWidth: '95vw', padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20 }}>Book Appointment</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {error && <div style={{ background: 'rgba(240,106,106,0.1)', border: '1px solid rgba(240,106,106,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--danger)', marginBottom: 16 }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div><label style={lbl}>Patient Name</label><input style={inp} value={form.patient_name} onChange={e => set('patient_name', e.target.value)} placeholder="Full name" /></div>
          <div><label style={lbl}>Phone</label><input style={inp} value={form.patient_phone} onChange={e => set('patient_phone', e.target.value)} placeholder="+91 XXXXX XXXXX" /></div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Doctor</label>
          <select style={inp} value={form.doctor_id} onChange={e => set('doctor_id', e.target.value)}>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div><label style={lbl}>Date</label><input type="date" style={inp} value={form.appointment_date} onChange={e => set('appointment_date', e.target.value)} /></div>
          <div><label style={lbl}>Time Slot</label>
            <select style={inp} value={form.appointment_time} onChange={e => set('appointment_time', e.target.value)}>
              {times.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Reason for Visit</label>
          <textarea style={{ ...inp, resize: 'vertical', minHeight: 72 }} value={form.reason} onChange={e => set('reason', e.target.value)} placeholder="Describe symptoms..." />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={lbl}>Booking Type</label>
          <select style={inp} value={form.booking_type} onChange={e => set('booking_type', e.target.value)}>
            <option value="manual">📋 Manual (Staff)</option>
            <option value="online">🤖 Online (AI Receptionist)</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' }}>Cancel</button>
          <button onClick={submit} disabled={saving} style={{ padding: '9px 16px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, background: 'var(--accent)', color: '#fff', border: 'none', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  )
}