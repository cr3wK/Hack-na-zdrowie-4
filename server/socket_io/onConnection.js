import userHandlers from './handlers/user.handlers.js'
import messageHandlers from './handlers/message.handlers.js'
let currentRoom = null;
export default function onConnection(io, socket) {
  const { roomId, userName } = socket.handshake.query

  socket.roomId = roomId
  socket.userName = userName

  socket.join(roomId);
  currentRoom = roomId;
  socket.on('ChangeRoom', (toRoom)=>{

      if (currentRoom) {
        socket.leave(currentRoom);
      }
      socket.join(toRoom);
      currentRoom = toRoom;

  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  userHandlers(io, socket)

  messageHandlers(io, socket)
}
