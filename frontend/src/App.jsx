import { useState, useEffect } from 'react'
import { RocketLaunch, PaperPlane, ShieldCheck } from '@phosphor-icons/react'
import RadarScanner from './components/RadarScanner'
import DeviceList from './components/DeviceList'
import FlashCodeDisplay from './components/FlashCodeDisplay'
import ReceiverInput from './components/ReceiverInput'
import TransferZone from './components/TransferZone'
import CloudClipboard from './components/CloudClipboard'
import { useWebRTC } from './hooks/useWebRTC'

function App() {
  const [view, setView] = useState('home') // home, sender, receiver
  const [discoveredDevices, setDiscoveredDevices] = useState([])
  const { generateCode, flashCode, verifyCodeAndConnect, connectionStatus } = useWebRTC()

  useEffect(() => {
    if (view === 'sender' && !flashCode) {
      generateCode()
    }
  }, [view, flashCode, generateCode])

  const handleBluetoothDiscovery = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true
      })
      
      const newDevice = {
        id: device.id,
        name: device.name || 'Unknown Device',
        type: device.name?.toLowerCase().includes('iphone') || device.name?.toLowerCase().includes('android') ? 'mobile' : 'desktop'
      }

      setDiscoveredDevices(prev => {
        if (prev.find(d => d.id === newDevice.id)) return prev
        return [...prev, newDevice]
      })
    } catch (error) {
      console.error('Bluetooth Discovery Error:', error)
    }
  }

  const handleReceiveCode = async (code) => {
    try {
      await verifyCodeAndConnect(code)
      console.log('Connected natively!')
    } catch (e) {
      console.error(e)
      throw e // throw so ReceiverInput can show error shake
    }
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <RocketLaunch size={32} color="var(--tech-blue)" weight="regular" />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Mooka File</h1>
      </header>

      {/* Main Content Area */}
      <main className="glass-panel" style={{ padding: '2rem', width: '90%', maxWidth: '800px', minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {view === 'home' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Seamless Flow,<br/>Professional Grade.</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>100% Secure P2P Local File Transfer</p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setView('sender')} style={btnStyle(true)}>
                <PaperPlane size={24} weight="regular" /> Send Files
              </button>
              <button onClick={() => setView('receiver')} style={btnStyle(false)}>
                <ShieldCheck size={24} weight="regular" /> Receive Files
              </button>
            </div>
            
            <div onClick={handleBluetoothDiscovery} style={{ marginTop: '3rem', transform: 'scale(0.8)', cursor: 'pointer' }}>
              <RadarScanner isScanning={true} />
            </div>
          </div>
        )}

        {view === 'sender' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={() => setView('home')} style={{ alignSelf: 'flex-start', marginBottom: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--base-indigo)' }}>← Back</button>
            
            {connectionStatus === 'connected' ? (
               <div style={{ width: '100%' }}>
                 <TransferZone status="idle" />
                 <CloudClipboard />
               </div>
            ) : (
               <>
                 <FlashCodeDisplay code={flashCode} />
                 <div style={{ marginTop: '2rem', width: '100%' }}>
                   <DeviceList devices={discoveredDevices} onScan={handleBluetoothDiscovery} />
                 </div>
               </>
            )}
          </div>
        )}


        {view === 'receiver' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button onClick={() => setView('home')} style={{ alignSelf: 'flex-start', marginBottom: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--base-indigo)' }}>← Back</button>
            
            {connectionStatus === 'connected' ? (
               <div style={{ width: '100%' }}>
                 <TransferZone status="idle" />
                 <CloudClipboard />
               </div>
            ) : (
               <ReceiverInput onComplete={handleReceiveCode} />
            )}
          </div>
        )}

      </main>
    </div>
  )
}

const btnStyle = (primary) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '500',
  cursor: 'pointer',
  border: primary ? 'none' : '1px solid var(--tech-blue)',
  backgroundColor: primary ? 'var(--tech-blue)' : 'transparent',
  color: primary ? 'white' : 'var(--tech-blue)',
  transition: 'all 0.2s',
})

export default App
