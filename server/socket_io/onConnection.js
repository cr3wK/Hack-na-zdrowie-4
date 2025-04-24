import userHandlers from './handlers/user.handlers.js'
import messageHandlers from './handlers/message.handlers.js'

export default function onConnection(io, socket) {
  const { roomId, userName } = socket.handshake.query

  socket.roomId = roomId
  socket.userName = userName

  io.on('joinRoom', (roomId)=>{
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  userHandlers(io, socket)

  messageHandlers(io, socket)
}
