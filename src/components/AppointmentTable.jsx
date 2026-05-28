export default function AppointmentTable({ appointments, loading, title }) {
  const thStyle = { fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.7px', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontWeight: 500 }
  const tdStyle = { padding: '13px 16px', fontSize: 13, borderBottom: '1px solid rgba(42,47,66,0.6)' }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{title}</span>
        <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 20, background: 'rgba(79,142,247,0.15)', color: 'var(--accent)', fontWeight: 500 }}>{appointments.length} appointments</span>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
      ) : appointments.length === 0 ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>No appointments found.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Patient', 'Time', 'Doctor', 'Type', 'Status'].map(h => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id} style={{ transition: 'background 0.12s' }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500 }}>{a.patient_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{a.reason}</div>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 500 }}>{a.appointment_time}</td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{a.doctors?.name || '—'}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.doctors?.specialization}</div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: a.booking_type === 'online' ? 'rgba(56,217,169,0.12)' : 'rgba(244,167,66,0.12)', color: a.booking_type === 'online' ? 'var(--accent2)' : 'var(--warn)' }}>
                      {a.booking_type === 'online' ? '🤖 Online' : '📋 Manual'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: a.status === 'confirmed' ? 'rgba(79,142,247,0.12)' : a.status === 'pending' ? 'rgba(244,167,66,0.12)' : 'rgba(42,47,66,0.8)', color: a.status === 'confirmed' ? 'var(--accent)' : a.status === 'pending' ? 'var(--warn)' : 'var(--muted)' }}>
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}