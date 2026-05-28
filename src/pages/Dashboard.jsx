import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import DoctorList from '../components/DoctorList'
import AppointmentTable from '../components/AppointmentTable'
import BookingModal from '../components/BookingModal'
import { Plus, Search, CalendarPlus } from 'lucide-react'

export default function Dashboard() {
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctors()
    fetchAppointments()
  }, [])

  async function fetchDoctors() {
    const { data } = await supabase.from('doctors').select('*').order('name')
    if (data) setDoctors(data)
  }

  async function fetchAppointments() {
    setLoading(true)
    const today = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('appointments')
      .select('*, doctors(name, specialization, color)')
      .eq('appointment_date', today)
      .order('appointment_time')
    if (data) setAppointments(data)
    setLoading(false)
  }

  const filtered = appointments.filter(a => {
    const matchDoctor = selectedDoctor ? a.doctor_id === selectedDoctor.id : true
    const matchSearch = search
      ? a.patient_name.toLowerCase().includes(search.toLowerCase()) ||
        (a.reason || '').toLowerCase().includes(search.toLowerCase())
      : true
    return matchDoctor && matchSearch
  })

  const stats = {
    total: appointments.length,
    online: appointments.filter(a => a.booking_type === 'online').length,
    manual: appointments.filter(a => a.booking_type === 'manual').length,
    available: doctors.filter(d => d.available).length,
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main style={{ marginLeft: 240, flex: 1, padding: '32px', minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400 }}>
              Good morning, Admin 👋
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
              <Search size={15} color="var(--muted)" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search patients..."
                style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 13, width: 160 }}
              />
            </div>
            <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, background: 'var(--accent)', color: '#fff', border: 'none' }}>
              <Plus size={15} /> New Appointment
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: "Today's Appointments", value: stats.total, sub: 'All bookings today', subColor: 'var(--accent2)' },
            { label: 'Online Bookings', value: stats.online, sub: 'Via AI Receptionist', subColor: 'var(--accent2)' },
            { label: 'Manual Bookings', value: stats.manual, sub: 'By staff', subColor: 'var(--warn)' },
            { label: 'Doctors Available', value: stats.available, sub: 'On duty today', subColor: 'var(--accent2)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 600 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: s.subColor, marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 16px', marginBottom: 24, width: 'fit-content', fontSize: 13 }}>
          <span style={{ color: 'var(--muted)', marginRight: 4 }}>Booking type:</span>
          {[['var(--accent2)', '🤖 Online (AI Receptionist)'], ['var(--warn)', '📋 Manual (Staff)']].map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
          <DoctorList
            doctors={doctors}
            appointments={appointments}
            selectedDoctor={selectedDoctor}
            onSelect={d => setSelectedDoctor(prev => prev?.id === d.id ? null : d)}
          />
          <AppointmentTable
            appointments={filtered}
            loading={loading}
            title={selectedDoctor ? `${selectedDoctor.name} — Today` : 'All Appointments — Today'}
          />
        </div>
      </main>

      {showModal && (
        <BookingModal
          doctors={doctors}
          appointments={appointments}
          onClose={() => setShowModal(false)}
          onBooked={() => { fetchAppointments(); setShowModal(false) }}
        />
      )}
    </div>
  )
}