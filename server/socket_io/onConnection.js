import userHandlers from './handlers/user.handlers.js';
import messageHandlers from './handlers/message.handlers.js';

let currentRoom = null;

export default function onConnection(io, socket) {
    const { roomId, userName, specialization, email } = socket.handshake.query;

    // Сохраняем данные пользователя в сокете
    socket.roomId = roomId;
    socket.userName = userName;
    socket.specialization = specialization;
    socket.email = email;

    // Присоединяем в заданную комнату
    socket.join(roomId);
    currentRoom = roomId;

    console.log(`Doctor ${userName} (${specialization}) connected to room ${roomId}`);

    // Смена комнат (по событию 'ChangeRoom')
    socket.on('ChangeRoom', (toRoom) => {
        if (currentRoom) {
            socket.leave(currentRoom);
            console.log(`Socket ${socket.id} left room ${currentRoom}`);
        }
        socket.join(toRoom);
        currentRoom = toRoom;
        console.log(`Socket ${socket.id} joined room ${toRoom}`);
    });

    // Обработка выхода из комнаты
    socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    // Подключаем обработчики пользователей (userHandlers)
    userHandlers(io, socket);

    // Подключаем обработчики сообщений (messageHandlers)
    messageHandlers(io, socket);
}