import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import NodeCache from 'node-cache'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')))

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Cache for 5 minutes (TTL: 300s)
const codeCache = new NodeCache({ stdTTL: 300, checkperiod: 60 })

// ALL other routes should serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('generate-code', (callback) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const roomId = uuidv4()
    codeCache.set(code, roomId)
    socket.join(roomId)
    callback({ code, roomId })
  })

  socket.on('verify-code', (code, callback) => {
    const roomId = codeCache.get(code)
    if (roomId) {
      socket.join(roomId)
      socket.to(roomId).emit('peer-connected', { roomId })
      callback({ success: true, roomId })
    } else {
      callback({ success: false, error: 'Invalid or expired code' })
    }
  })

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
  console.log(`Unified Mooka Server running on port ${PORT}`)
})
