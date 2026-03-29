import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const URL = 'http://localhost:3001'

export function useWebRTC() {
  const [socket, setSocket] = useState(null)
  const [peerConnection, setPeerConnection] = useState(null)
  const [roomId, setRoomId] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('idle') // idle, connecting, connected
  const [flashCode, setFlashCode] = useState('')

  const sendChannel = useRef(null)
  const receiveChannel = useRef(null)

  useEffect(() => {
    const s = io(URL)
    setSocket(s)

    s.on('connect', () => {
      console.log('Connected to signaling server')
    })

    s.on('peer-connected', async ({ roomId }) => {
      console.log('Peer connected to room:', roomId)
      setRoomId(roomId)
      createPeerConnection(s, roomId, true) // true since I generated code
    })

    s.on('offer', async (offer) => {
      if (!peerConnection) return
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      s.emit('answer', { answer, roomId })
    })

    s.on('answer', async (answer) => {
      if (!peerConnection) return
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    })

    s.on('ice-candidate', async (candidate) => {
      if (!peerConnection) return
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    })

    return () => { s.disconnect() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createPeerConnection = (sigSocket, room, isInitiator) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })

    setPeerConnection(pc)

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sigSocket.emit('ice-candidate', { candidate: event.candidate, roomId: room })
      }
    }

    if (isInitiator) {
      const dc = pc.createDataChannel('mookaDataChannel')
      sendChannel.current = dc
      setupDataChannel(dc)

      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer)
        sigSocket.emit('offer', { offer, roomId: room })
      })
    } else {
      pc.ondatachannel = (event) => {
        receiveChannel.current = event.channel
        setupDataChannel(event.channel)
      }
    }
  }

  const setupDataChannel = (dc) => {
    dc.onopen = () => {
      console.log('Data channel open!')
      setConnectionStatus('connected')
    }
    dc.onclose = () => {
      console.log('Data channel closed')
      setConnectionStatus('idle')
    }
    dc.onmessage = (event) => {
      console.log('Received message:', event.data)
    }
  }

  const generateCode = () => {
    if (socket) {
      socket.emit('generate-code', (res) => {
        setFlashCode(res.code)
      })
    }
  }

  const verifyCodeAndConnect = (code) => {
    return new Promise((resolve, reject) => {
      if (socket) {
        socket.emit('verify-code', code, (res) => {
          if (res.success) {
            setRoomId(res.roomId)
            createPeerConnection(socket, res.roomId, false)
            resolve(res)
          } else {
            reject(new Error(res.error))
          }
        })
      }
    })
  }

  return { generateCode, flashCode, verifyCodeAndConnect, connectionStatus }
}
