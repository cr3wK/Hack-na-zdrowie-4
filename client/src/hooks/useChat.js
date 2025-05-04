import { SERVER_URI, USER_KEY } from 'constants';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import storage from 'utils/storage';

export default function useChat(currentRoomId) {
  const [user, setUser] = useState(storage.get(USER_KEY) || {});
  const [users, setUsers] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [log, setLog] = useState(null);
  const [rooms, setRooms] = useState([]);

  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SERVER_URI, {
        query: {
          userName: user?.name,
        },
      });

      socketRef.current.emit('message:get');
      socketRef.current.emit('room_list:get');

      socketRef.current.on('log', setLog);
      socketRef.current.on('user_list:update', setUsers);
      socketRef.current.on('message_list:update', (allMsgs) => {
        setAllMessages(allMsgs);
      });
      socketRef.current.on('room_list:update', setRooms);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('log');
        socketRef.current.off('user_list:update');
        socketRef.current.off('message_list:update');
        socketRef.current.off('room_list:update');
      }
    };
  }, []);

  const sendMessage = (message) => {
    socketRef.current.emit('message:add', message);
  };

  const removeMessage = (message) => {
    socketRef.current.emit('message:remove', message);
  };

  const createRoom = (roomName) => {
    socketRef.current.emit('room:create', roomName);
  };

  const joinRoom = (roomName) => {
    const updatedUser = { ...user, roomId: roomName };
    setUser(updatedUser);
    storage.set(USER_KEY, updatedUser);
    socketRef.current.emit('room:join', roomName);
  };

  // 🔍 Фильтруем сообщения локально по roomId
  const messages = allMessages.filter(msg => msg.roomId === currentRoomId);

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
