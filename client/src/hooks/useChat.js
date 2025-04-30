import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { SERVER_URI, USER_KEY } from 'constants';
import storage from 'utils/storage';

export default function useChat(currentRoomId) {
  const [user, setUser] = useState(storage.get(USER_KEY) || {});
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [log, setLog] = useState(null);
  const [rooms, setRooms] = useState([]);

  const socketRef = useRef(null);

  if (!socketRef.current) {
    socketRef.current = io(SERVER_URI, {
      query: {
        roomId: user?.roomId,
        userName: user?.name,
      },
    });
  }

  const socket = socketRef.current;

  useEffect(() => {
    if (currentRoomId && currentRoomId !== user.roomId) {
      socket.emit('room:join', currentRoomId);
      const updatedUser = { ...user, roomId: currentRoomId };
      storage.set(USER_KEY, updatedUser);
      setUser(updatedUser);
    }
  }, [currentRoomId]);

  useEffect(() => {
    socket.emit('user:add', user);
    socket.emit('message:get');
    socket.emit('room_list:get');

    socket.on('log', setLog);
    socket.on('user_list:update', (allUsers) => {
      setUsers(allUsers.filter(u => u.roomId === currentRoomId));
    });

    socket.on('message_list:update', (allMessages) => {
      setMessages(allMessages.filter(m => m.roomId === currentRoomId));
    });

    socket.on('room_list:update', setRooms);

    return () => {
      socket.off('log');
      socket.off('user_list:update');
      socket.off('message_list:update');
      socket.off('room_list:update');
    };
  }, [currentRoomId]); // <-- пересоздаём обработчики при смене комнаты

  const sendMessage = (message) => {
    socket.emit('message:add', { ...message, roomId: currentRoomId });
  };

  const removeMessage = (message) => {
    socket.emit('message:remove', message);
  };

  const createRoom = (roomName) => {
    socket.emit('room:create', roomName);
  };

  const joinRoom = (roomName) => {
    socket.emit('room:join', roomName);
  };

  return {
    user,
    users,
    messages,
    log,
    rooms,
    sendMessage,
    removeMessage,
    createRoom,
    joinRoom,
  };
}
