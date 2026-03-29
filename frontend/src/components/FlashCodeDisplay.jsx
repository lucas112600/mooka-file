import { translations } from '../translations'

export default function FlashCodeDisplay({ code, lang }) {
  const t = translations[lang]
  const formattedCode = code ? code.toString().split('').join(' ') : '0 0 0 0 0 0'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
      <div style={{ padding: '2rem', borderRadius: '24px', background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', textAlign: 'center', width: '100%' }}>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.waiting}</p>
        <h2 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '0.2em', color: 'var(--base-indigo)', fontFamily: 'monospace' }}>{formattedCode}</h2>
      </div>
      <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{t.ready}</p>
    </div>
  )
}
