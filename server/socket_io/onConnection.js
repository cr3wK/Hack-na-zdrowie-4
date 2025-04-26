import userHandlers from './handlers/user.handlers.js'
import messageHandlers from './handlers/message.handlers.js'

const rooms = new Set()

export default function onConnection(io, socket) {
  const { roomId, userName } = socket.handshake.query

  socket.roomId = roomId
  socket.userName = userName

  if (roomId) {
    rooms.add(roomId)
    socket.join(roomId)
  }

  // Хендлеры
  userHandlers(io, socket)
  messageHandlers(io, socket)

  // Комнаты
  socket.on('room:create', (roomName) => {
    if (!rooms.has(roomName)) {
      rooms.add(roomName)
      io.emit('room_list:update', Array.from(rooms))
    }
  })

  socket.on('room:join', (roomName) => {
    const previousRoom = socket.roomId
    if (previousRoom) socket.leave(previousRoom)

    socket.join(roomName)
    socket.roomId = roomName
    socket.emit('room:joined', roomName)
  })

  socket.on('room_list:get', () => {
    socket.emit('room_list:update', Array.from(rooms))
  })
}