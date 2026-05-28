export default function DoctorList({ doctors, appointments, selectedDoctor, onSelect }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>Doctors</span>
        <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 20, background: 'rgba(79,142,247,0.15)', color: 'var(--accent)', fontWeight: 500 }}>{doctors.length} doctors</span>
      </div>
      {doctors.map(doc => {
        const count = appointments.filter(a => a.doctor_id === doc.id).length
        const isSelected = selectedDoctor?.id === doc.id
        return (
          <div
            key={doc.id}
            onClick={() => onSelect(doc)}
            style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, background: isSelected ? 'rgba(79,142,247,0.08)' : 'transparent', borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent', transition: 'background 0.15s' }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, background: doc.color + '22', color: doc.color, flexShrink: 0 }}>
              {doc.avatar_initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{doc.specialization}</div>
              <div style={{ fontSize: 11, color: 'var(--accent2)', marginTop: 4 }}>🕐 {doc.timing} · {count} appt today</div>
            </div>
            <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, fontWeight: 500, background: doc.available ? 'rgba(56,217,169,0.12)' : 'rgba(240,106,106,0.12)', color: doc.available ? 'var(--accent2)' : 'var(--danger)', flexShrink: 0 }}>
              {doc.available ? 'Available' : 'Off duty'}
            </span>
          </div>
        )
      })}
    </div>
  )
}