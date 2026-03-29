import { CirclesThree } from '@phosphor-icons/react'

export default function RadarScanner({ isScanning }) {
  return (
    <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className={`radar-scan ${isScanning ? 'scanning' : ''}`} style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '2px solid var(--tech-blue)',
        animation: isScanning ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none',
        opacity: 0.2
      }}></div>
      <CirclesThree size={48} color="var(--tech-blue)" weight="regular" />
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
