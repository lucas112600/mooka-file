import { useState, useEffect } from 'react'
import { 
  FilePdf, FileImage, File, PaperPlaneTilt, Spinner, CloudArrowDown, 
  FileCode, FileArchive, FileDoc, FileXls, FileVideo, CheckCircle, Download
} from '@phosphor-icons/react'
import { translations } from '../translations'

export default function TransferZone({ lang, sendFile, progress, receivedFile }) {
  const [queue, setQueue] = useState([])
  const [isSending, setIsSending] = useState(false)
  const t = translations[lang]

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase()
    if (['pdf'].includes(ext)) return <FilePdf size={32} weight="duotone" color="#EF4444" />
    if (['jpg', 'jpeg', 'png', 'svg', 'gif'].includes(ext)) return <FileImage size={32} weight="duotone" color="#3B82F6" />
    if (['mp4', 'mov', 'avi'].includes(ext)) return <FileVideo size={32} weight="duotone" color="#8B5CF6" />
    if (['zip', 'rar', '7z', 'tar'].includes(ext)) return <FileArchive size={32} weight="duotone" color="#F59E0B" />
    if (['doc', 'docx'].includes(ext)) return <FileDoc size={32} weight="duotone" color="#2563EB" />
    if (['xls', 'xlsx', 'csv'].includes(ext)) return <FileXls size={32} weight="duotone" color="#10B981" />
    if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py'].includes(ext)) return <FileCode size={32} weight="duotone" color="#64748B" />
    return <File size={32} weight="duotone" color="#94A3B8" />
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setQueue(prev => [...prev, ...files])
    }
  }

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setQueue(prev => [...prev, ...files])
    }
  }

  useEffect(() => {
    if (queue.length > 0 && !isSending) {
      processQueue()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, isSending])

  const processQueue = async () => {
    setIsSending(true)
    const nextFile = queue[0]
    await sendFile(nextFile)
    setQueue(prev => prev.slice(1))
    setIsSending(false)
  }

  return (
    <div className="transfer-wrapper" style={{ width: '100%' }}>
      {/* Drop Zone */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
        className="glass-panel drop-zone"
      >
        <input 
          id="file-input" 
          type="file" 
          multiple 
          hidden 
          onChange={handleFileInput} 
        />
        
        {!isSending && !receivedFile && (
          <div style={{ textAlign: 'center' }}>
            <PaperPlaneTilt size={48} weight="duotone" color="var(--tech-blue)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '4px' }}>{t.drop}</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{t.batch}</p>
          </div>
        )}

        {isSending && (
          <div style={{ textAlign: 'center', width: '100%', padding: '0 2rem' }}>
            <div style={{ marginBottom: '1rem' }}>{getFileIcon(queue[0]?.name || 'file')}</div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{t.transferring} ({progress}%)</h3>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>{queue[0]?.name}</p>
          </div>
        )}

        {receivedFile && !isSending && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <CheckCircle size={48} weight="fill" color="var(--success-green)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{t.completed}</h3>
            <a 
              href={receivedFile.url} 
              download={receivedFile.name} 
              className="btn-primary" 
              style={{ padding: '8px 16px', fontSize: '0.875rem', marginTop: '1rem', display: 'inline-flex' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={18} weight="bold" /> {receivedFile.name}
            </a>
          </div>
        )}
      </div>

      {/* Queue List */}
      {queue.length > 1 && (
        <div className="queue-list" style={{ marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px', fontWeight: '600' }}>
            {lang === 'en' ? 'QUEUE' : '待傳輸隊列'} ({queue.length - (isSending ? 1 : 0)})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {queue.slice(isSending ? 1 : 0).map((file, idx) => (
              <div key={idx} className="queue-item">
                {getFileIcon(file.name)}
                <span style={{ fontSize: '0.875rem', marginLeft: '10px' }}>{file.name}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#94a3b8' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .drop-zone {
          width: 100%;
          min-height: 220px;
          border: 2px dashed #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .drop-zone:hover {
          border-color: var(--tech-blue);
          background: rgba(59, 130, 246, 0.05);
        }
        .progress-bar-container {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 100px;
          overflow: hidden;
          margin-top: 12px;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--tech-blue);
          transition: width 0.3s ease-out;
        }
        .queue-item {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}

