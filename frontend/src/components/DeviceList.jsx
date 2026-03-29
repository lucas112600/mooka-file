import { Monitor, Smartphone, Bluetooth } from '@phosphor-icons/react'
import { translations } from '../translations'

export default function DeviceList({ devices, onScan, lang }) {
  const t = translations[lang]
  return (
    <div style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'var(--glass-bg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', color: '#64748b' }}>{t.nearby}</h3>
        <button 
          onClick={onScan}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', 
            background: 'var(--tech-blue)', color: 'white', border: 'none', fontSize: '0.75rem', cursor: 'pointer' 
          }}
        >
          <Bluetooth size={16} weight="fill" /> {t.scan}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {devices.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', padding: '2rem' }}>
            {t.noDevices}
          </p>
        ) : (
          devices.map(device => (
            <div key={device.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px', borderRadius: '8px', background: 'white', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
               {device.type === 'desktop' ? <Monitor size={24} weight="regular" /> : <Smartphone size={24} weight="regular" />}
               <span style={{ fontWeight: 500 }}>{device.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


