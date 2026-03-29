import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const URL = 'https://mooka-file.onrender.com'
const CHUNK_SIZE = 64 * 1024 // 64KB

/**
 * Hook to manage WebRTC P2P connection and signaling.
 * @returns {object} The WebRTC state and control functions.
 */
export function useWebRTC() {
  const [socket, setSocket] = useState(null)
  const [peerConnection, setPeerConnection] = useState(null)
  const [roomId, setRoomId] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('idle')
  const [flashCode, setFlashCode] = useState('')
  const [transferProgress, setTransferProgress] = useState(0)
  const [receivedFile, setReceivedFile] = useState(null)

  const sendChannel = useRef(null)
  const receiveChannel = useRef(null)
  const receivingMetadata = useRef(null)
  const receivedChunks = useRef([])

  useEffect(() => {
    const s = io(URL)
    setSocket(s)

    s.on('connect', () => {
      console.log('Connected to signaling server')
    })

    s.on('peer-connected', async ({ roomId: rId }) => {
      setRoomId(rId)
      createPeerConnection(s, rId, true)
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

    return () => {
      s.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerConnection, roomId])

  /**
   * Initializes the RTCPeerConnection.
   * @param {object} sigSocket The signaling socket.
   * @param {string} room The roomId.
   * @param {boolean} isInitiator Whether the peer is the initiator.
   * @returns {void}
   */
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
      const dc = pc.createDataChannel('mookaDataChannel', { ordered: true })
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

  /**
   * Configures the data channel.
   * @param {object} dc The RTCDataChannel.
   * @returns {void}
   */
  const setupDataChannel = (dc) => {
    dc.binaryType = 'arraybuffer'
    dc.onopen = () => {
      setConnectionStatus('connected')
    }
    dc.onclose = () => {
      setConnectionStatus('idle')
    }
    dc.onmessage = (event) => {
      if (typeof event.data === 'string') {
        const msg = JSON.parse(event.data)
        if (msg.type === 'metadata') {
          receivingMetadata.current = msg
          receivedChunks.current = []
          setTransferProgress(0)
        } else if (msg.type === 'eof') {
          const blob = new Blob(receivedChunks.current, {
            type: receivingMetadata.current.fileType
          })
          setReceivedFile({
            name: receivingMetadata.current.fileName,
            blob,
            url: window.URL.createObjectURL(blob)
          })
          setTransferProgress(100)
          receivedChunks.current = []
        }
      } else {
        receivedChunks.current.push(event.data)
        let currentSize = 0
        receivedChunks.current.forEach((c) => {
          currentSize += c.byteLength
        })
        if (receivingMetadata.current) {
          setTransferProgress(Math.floor((currentSize / receivingMetadata.current.fileSize) * 100))
        }
      }
    }
  }

  /**
   * Sends a file through the data channel in chunks.
   * @param {object} file The file objects.
   * @returns {Promise<void>}
   */
  const sendFile = async (file) => {
    if (!sendChannel.current || sendChannel.current.readyState !== 'open') return

    const dc = sendChannel.current
    const buffer = await file.arrayBuffer()
    
    dc.send(JSON.stringify({
      type: 'metadata',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    }))

    let offset = 0
    while (offset < buffer.byteLength) {
      if (dc.bufferedAmount > 65535) {
        await new Promise((resolve) => {
          dc.onbufferedamountlow = () => {
            dc.onbufferedamountlow = null
            resolve()
          }
        })
      }

      const chunk = buffer.slice(offset, offset + CHUNK_SIZE)
      dc.send(chunk)
      offset += chunk.byteLength
      setTransferProgress(Math.floor((offset / buffer.byteLength) * 100))
    }

    dc.send(JSON.stringify({ type: 'eof' }))
  }

  /**
   * Requests a new flash code.
   * @returns {void}
   */
  const generateCode = () => {
    if (socket) {
      socket.emit('generate-code', (res) => {
        setFlashCode(res.code)
      })
    }
  }

  /**
   * Verifies the code and initiates connection.
   * @param {string} code The 6-digit code.
   * @returns {Promise<object>}
   */
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

  return {
    generateCode,
    flashCode,
    verifyCodeAndConnect,
    connectionStatus,
    sendFile,
    transferProgress,
    receivedFile
  }
}
