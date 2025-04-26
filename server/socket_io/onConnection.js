import userHandlers from './handlers/user.handlers.js';
import messageHandlers from './handlers/message.handlers.js';

const rooms = new Set();

export default function onConnection(io, socket) {
  const { roomId, userName } = socket.handshake.query;

  socket.roomId = roomId;
  socket.userName = userName;

  // If a `roomId` exists in the handshake query, join the room
  if (roomId) {
    rooms.add(roomId);
    socket.join(roomId);
    console.log(`User "${userName}" connected and joined room "${roomId}"`);
  }

  // Listen for events related to room management
  socket.on('joinRoom', (roomId) => {
    const previousRoom = socket.roomId;
    if (previousRoom) socket.leave(previousRoom); // Leave the previous room
    rooms.add(roomId); // Add the room to the list of available rooms
    socket.join(roomId); // Join the new room
    socket.roomId = roomId; // Update the socket's current roomId
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('leaveRoom', (roomId) => {
    if (roomId === socket.roomId) {
      socket.leave(roomId); // Leave the room
      console.log(`Socket ${socket.id} left room ${roomId}`);
      socket.roomId = null; // Clear the room association from the socket
    }
  });

  // Register additional handlers (user and message events)
  userHandlers(io, socket);
  messageHandlers(io, socket);

  // Room creation
  socket.on('room:create', (roomName) => {
    if (!rooms.has(roomName)) {
      rooms.add(roomName); // Add a new room to the set
      io.emit('room_list:update', Array.from(rooms)); // Notify clients about the updated room list
      console.log(`Room "${roomName}" was created`);
    }
  });

  // Join a specific room
  socket.on('room:join', (roomName) => {
    const previousRoom = socket.roomId; // Get the current room
    if (previousRoom) socket.leave(previousRoom); // Leave the current room
    socket.join(roomName); // Join the new room
    socket.roomId = roomName; // Update the socket's current roomId
    socket.emit('room:joined', roomName); // Emit an event back to confirm the join
    console.log(`User "${socket.userName}" joined room "${roomName}"`);
  });

  // Handle a request to retrieve the list of rooms
  socket.on('room_list:get', () => {
    socket.emit('room_list:update', Array.from(rooms)); // Send back the list of rooms
  });
}