import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import NodeCache from 'node-cache'
import cors from 'cors'

const app = express()
app.use(cors())

app.get('/', (req, res) => {
  res.send('Mooka Signaling Server is Running. Visit port 3000 for the Frontend UI!')
})

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Flash codes are valid for 5 minutes (300 seconds)
const codeCache = new NodeCache({ stdTTL: 300, checkperiod: 60 })

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Sender generates a code
  socket.on('generate-code', (callback) => {
    // Generate 6 random digits
    let hash = ''
    for (let i = 0; i < 6; i++) {
       hash += Math.floor(Math.random() * 10).toString()
    }
    
    codeCache.set(hash, socket.id)
    console.log(`Generated code: ${hash} for socket: ${socket.id}`)
    callback({ code: hash })
  })

  // Receiver verifies the code
  socket.on('verify-code', (code, callback) => {
    const senderSocketId = codeCache.get(code)

    if (senderSocketId) {
       // Join both into a room
       const room = uuidv4()
       socket.join(room)
       io.sockets.sockets.get(senderSocketId)?.join(room)

       console.log(`Match success! Room ${room} created for ${socket.id} & ${senderSocketId}`)
       
       // Inform sender someone connected
       io.to(senderSocketId).emit('peer-connected', { roomId: room, peerId: socket.id })
       
       callback({ success: true, roomId: room })
    } else {
       callback({ success: false, error: 'Invalid or expired code' })
    }
  })

  // WebRTC Signaling
  socket.on('offer', (data) => {
    socket.to(data.roomId).emit('offer', data.offer)
  })

  socket.on('answer', (data) => {
    socket.to(data.roomId).emit('answer', data.answer)
  })

  socket.on('ice-candidate', (data) => {
    socket.to(data.roomId).emit('ice-candidate', data.candidate)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Mooka Signaling Server running on port ${PORT}`)
})
