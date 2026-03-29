import { useState, useEffect } from 'react'
import { Clock, Copy } from '@phosphor-icons/react'

export default function FlashCodeDisplay({ code }) {
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const formattedCode = code ? `${code.slice(0, 3)} ${code.slice(3, 6)}` : '...'

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const progress = (timeLeft / 300) * 100

  return (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', minWidth: '320px' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <Clock size={20} weight="regular" /> The Flash Code
      </h2>
      
      <div style={{ fontSize: '3rem', fontWeight: '700', letterSpacing: '8px', color: 'var(--tech-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <span>{code}</span>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} title="Copy Code">
          <Copy size={24} weight="regular" />
        </button>
      </div>

      <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--tech-blue)', transition: 'width 1s linear' }} />
      </div>
      <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
        Expires in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </p>
    </div>
  )
}
