import { FilePdf, FileImage, File, PaperPlaneTilt, Spinner, CloudArrowDown } from '@phosphor-icons/react'

export default function TransferZone({ status }) { // 'idle', 'sending', 'receiving', 'done'
  return (
    <div style={{ width: '100%', height: '200px', border: '2px dashed var(--tech-blue)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}>
      
      {status === 'idle' && (
        <>
          <File size={48} weight="regular" color="var(--tech-blue)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--base-indigo)', marginBottom: '0.5rem' }}>Drag & Drop Files Here</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>or click to browse from device</p>
        </>
      )}

      {status === 'sending' && (
        <>
          <PaperPlaneTilt size={48} weight="regular" color="var(--tech-blue)" className="animate-pulse" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--base-indigo)' }}>Sending files...</h3>
          <div style={{ marginTop: '1rem' }}>
            <Spinner size={24} weight="regular" color="#64748b" className="animate-spin" />
          </div>
        </>
      )}

      {status === 'receiving' && (
        <>
          <CloudArrowDown size={48} weight="regular" color="var(--success-green)" className="animate-pulse" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--base-indigo)' }}>Receiving files...</h3>
          <div style={{ marginTop: '1rem' }}>
            <Spinner size={24} weight="regular" color="#64748b" className="animate-spin" />
          </div>
        </>
      )}
      
      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  )
}
