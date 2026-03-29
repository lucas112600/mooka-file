import { useState, useRef, useEffect } from 'react'
import { Key, Warning, Check } from '@phosphor-icons/react'

export default function ReceiverInput({ onComplete }) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [status, setStatus] = useState('idle') // 'idle' | 'success' | 'error'
  const inputs = useRef([])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  const handleChange = (e, index) => {
    const value = e.target.value
    if (/[^0-9]/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }

    if (newCode.every(v => v !== '')) {
      handleComplete(newCode.join(''))
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handleComplete = (fullCode) => {
    // Simulate verification
    if (fullCode === '482916') {
       setStatus('success')
       setTimeout(() => onComplete(fullCode), 1000)
    } else {
       setStatus('error')
       setTimeout(() => {
         setStatus('idle')
         setCode(['', '', '', '', '', ''])
         inputs.current[0]?.focus()
       }, 800)
    }
  }

  return (
    <div className={`glass-panel ${status === 'error' ? 'animate-shake' : ''} ${status === 'success' ? 'animate-success-flash' : ''}`} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: status === 'error' ? 'var(--danger-red)' : status === 'success' ? 'var(--success-green)' : 'var(--base-indigo)' }}>
        {status === 'idle' && <Key size={24} weight="regular" />}
        {status === 'error' && <Warning size={24} weight="regular" />}
        {status === 'success' && <Check size={24} weight="regular" />}
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Enter Flash Code</h2>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        {code.map((v, i) => (
          <input
            key={i}
            ref={el => inputs.current[i] = el}
            type="text"
            maxLength={1}
            value={v}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            style={{ 
              width: '48px', height: '64px', fontSize: '2rem', textAlign: 'center', 
              borderRadius: '8px', border: `2px solid ${status === 'error' ? 'var(--danger-red)' : status === 'success' ? 'var(--success-green)' : 'var(--glass-border)'}`,
              background: 'var(--ice-gray)', outline: 'none', 
              transition: 'border-color 0.2s',
              color: 'var(--base-indigo)'
            }}
          />
        ))}
      </div>
      
      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
        請輸入發送端顯示的 6 位數代碼以建立安全連接。
      </p>
    </div>
  )
}
