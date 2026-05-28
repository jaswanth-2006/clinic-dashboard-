import { LayoutDashboard, Calendar, Users, Phone, Bell } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Calendar, label: 'Appointments' },
  { icon: Users, label: 'Doctors' },
  { icon: Phone, label: 'AI Call Logs' },
  { icon: Bell, label: 'Reminders' },
]

export default function Sidebar() {
  return (
    <aside style={{ width: 240, minHeight: '100vh', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '28px 0', position: 'fixed', top: 0, left: 0, zIndex: 100 }}>
      <div style={{ padding: '0 24px 28px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: 'var(--text)' }}>
          Medi<span style={{ color: 'var(--accent)' }}>Desk</span>
        </h1>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Clinic Management</p>
      </div>

      <nav style={{ padding: '20px 12px', flex: 1 }}>
        <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>Main</div>
        {navItems.map(({ icon: Icon, label, active }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: 14, color: active ? 'var(--accent)' : 'var(--muted)', background: active ? 'rgba(79,142,247,0.12)' : 'transparent', border: active ? '1px solid rgba(79,142,247,0.2)' : '1px solid transparent', marginBottom: 2, cursor: 'pointer', transition: 'all 0.15s' }}>
            <Icon size={17} />
            {label}
          </div>
        ))}
      </nav>

      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(56,217,169,0.08)', border: '1px solid rgba(56,217,169,0.2)', borderRadius: 20, padding: '6px 12px' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent2)', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 12, color: 'var(--accent2)' }}>AI Receptionist Active</span>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>
    </aside>
  )
}