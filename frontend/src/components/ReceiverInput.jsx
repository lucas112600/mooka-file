import { useState, useRef } from 'react'
import { translations } from '../translations'

export default function ReceiverInput({ onComplete, lang }) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState(false)
  const inputs = useRef([])
  const t = translations[lang]

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    
    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)

    if (value && index < 5) {
      inputs.current[index + 1].focus()
    }

    if (newCode.every(digit => digit !== '')) {
      handleSubmit(newCode.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus()
    }
  }

  const handleSubmit = async (fullCode) => {
    try {
      setError(false)
      await onComplete(fullCode)
    } catch (e) {
      setError(true)
      setTimeout(() => setError(false), 500)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>{t.inputCode}</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{t.codePrompt}</p>
      </div>

      <div style={{ display: 'flex', gap: '12px' }} className={error ? 'animate-shake' : ''}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={el => inputs.current[index] = el}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            style={{
              width: '50px', height: '64px', fontSize: '1.5rem', fontWeight: '700', textAlign: 'center',
              borderRadius: '12px', border: error ? '2px solid #ef4444' : '1px solid #e2e8f0',
              background: 'white', outline: 'none', transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}
          />
        ))}
      </div>
    </div>
  )
}
