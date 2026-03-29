import { useState } from 'react'
import { ClipboardText, PaperPlaneRight } from '@phosphor-icons/react'

export default function CloudClipboard() {
  const [text, setText] = useState('')

  return (
    <div style={{ width: '100%', marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
        <ClipboardText size={20} weight="regular" /> Cloud Clipboard
      </h3>
      <div style={{ position: 'relative' }}>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text, URLs, or passwords here to sync securely..."
          style={{ width: '100%', minHeight: '100px', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', fontSize: '0.875rem', color: 'var(--base-indigo)', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
        />
        <button style={{ position: 'absolute', bottom: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--tech-blue)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s', opacity: text ? 1 : 0.5 }}>
          <PaperPlaneRight size={20} weight="fill" />
        </button>
      </div>
    </div>
  )
}
