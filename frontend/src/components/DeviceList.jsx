import { Desktop, DeviceMobile } from '@phosphor-icons/react'

export default function DeviceList() {
  const mockDevices = [
    { id: '1', name: "Alex's Mac", type: 'desktop' },
    { id: '2', name: "Sarah's iPhone", type: 'mobile' }
  ]

  return (
    <div style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'var(--glass-bg)' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#64748b' }}>Nearby Devices</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {mockDevices.map(device => (
          <div key={device.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '10px', borderRadius: '8px', cursor: 'pointer', hover: { background: '#fff' } }}>
             {device.type === 'desktop' ? <Desktop size={24} weight="regular" /> : <DeviceMobile size={24} weight="regular" />}
             <span style={{ fontWeight: 500 }}>{device.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
