import { useState, useEffect } from 'react'
import { RocketLaunch, PaperPlane, ShieldCheck, Globe } from '@phosphor-icons/react'
import RadarScanner from './components/RadarScanner'
import DeviceList from './components/DeviceList'
import FlashCodeDisplay from './components/FlashCodeDisplay'
import ReceiverInput from './components/ReceiverInput'
import TransferZone from './components/TransferZone'
import CloudClipboard from './components/CloudClipboard'
import { useWebRTC } from './hooks/useWebRTC'
import { translations } from './translations'

function App() {
  const [lang, setLang] = useState('zhtw')
  const [view, setView] = useState('home') // home, sender, receiver
  const [discoveredDevices, setDiscoveredDevices] = useState([])
  const t = translations[lang]

  const { generateCode, flashCode, verifyCodeAndConnect, connectionStatus } = useWebRTC()

  useEffect(() => {
    if (view === 'sender' && !flashCode) {
      generateCode()
    }
  }, [view, flashCode, generateCode])

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zhtw' : 'en')
  }

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
      {/* Header Branding */}
      <header className="glass-panel main-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="logo-container">
             <RocketLaunch size={32} color="var(--tech-blue)" weight="fill" />
          </div>
          <div>
            <h1 className="brand-title">Mooka File</h1>
            <p className="brand-slogan">Seamless Flow, Professional Grade.</p>
          </div>
        </div>
        <button onClick={toggleLang} className="lang-toggle">
          <Globe size={20} weight="regular" />
          <span>{lang === 'en' ? '中文' : 'EN'}</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="glass-panel main-content">
        
        {view === 'home' && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div className="hero-text">
               <h2>{t.slogan.split(',')[0]}<br/>{t.slogan.split(',')[1]}</h2>
               <p>{t.subSlogan}</p>
            </div>
            
            <div className="action-buttons">
              <button onClick={() => setView('sender')} className="btn-primary">
                <PaperPlane size={24} weight="regular" /> {t.send}
              </button>
              <button onClick={() => setView('receiver')} className="btn-secondary">
                <ShieldCheck size={24} weight="regular" /> {t.receive}
              </button>
            </div>
            
            <div onClick={handleBluetoothDiscovery} className="radar-container">
              <RadarScanner isScanning={true} />
            </div>
          </div>
        )}

        {view === 'sender' && (
          <div className="view-container">
            <button onClick={() => setView('home')} className="back-btn">← {t.back}</button>
            
            {connectionStatus === 'connected' ? (
               <div style={{ width: '100%' }}>
                 <TransferZone 
                   lang={lang} 
                   sendFile={sendFile} 
                   progress={transferProgress} 
                   receivedFile={receivedFile} 
                 />
                 <CloudClipboard lang={lang} />
               </div>
            ) : (
               <>
                 <FlashCodeDisplay code={flashCode} lang={lang} />
                 <div style={{ marginTop: '2rem', width: '100%' }}>
                   <DeviceList devices={discoveredDevices} onScan={handleBluetoothDiscovery} lang={lang} />
                 </div>
               </>
            )}
          </div>
        )}

        {view === 'receiver' && (
          <div className="view-container">
            <button onClick={() => setView('home')} className="back-btn">← {t.back}</button>
            
            {connectionStatus === 'connected' ? (
               <div style={{ width: '100%' }}>
                 <TransferZone 
                   lang={lang} 
                   sendFile={sendFile} 
                   progress={transferProgress} 
                   receivedFile={receivedFile} 
                 />
                 <CloudClipboard lang={lang} />
               </div>
            ) : (
               <ReceiverInput onComplete={handleReceiveCode} lang={lang} />
            )}
          </div>
        )}

      </main>

      <footer className="professional-footer">
        © 2026 Mooka Technologies. All rights reserved.
      </footer>
    </div>
  )
}

export default App

