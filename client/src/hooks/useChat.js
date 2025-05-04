import { SERVER_URI, USER_KEY } from 'constants';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import storage from 'utils/storage';

export default function useChat(currentRoomId) {
  const [user, setUser] = useState(storage.get(USER_KEY) || {}); // Загружаем данные о пользователе
  const [users, setUsers] = useState([]); // Пользователи в чате
  const [allMessages, setAllMessages] = useState([]); // Все сообщения
  const [log, setLog] = useState(null); // Логи сервера
  const [rooms, setRooms] = useState([]); // Доступные комнаты

  const socketRef = useRef(null); // Ссылка на сокет

  // Запрос данных о специализации пользователя
  const fetchUserSpecialization = async () => {
    try {
      const response = await fetch(`${SERVER_URI}/doctor/me`, {
        method: 'GET',
        credentials: 'include', // Запрос с куками
      });

      if (!response.ok) {
        console.error('Невозможно получить данные пользователя');
        return;
      }

      const data = await response.json();

      // Обновление данных пользователя (добавление specialization)
      const updatedUser = {
        ...user,
        specialization: data.specialization || 'Unknown',
      };

      setUser(updatedUser);
      storage.set(USER_KEY, updatedUser); // Сохраняем обновлённые данные в хранилище
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
    }
  };

  useEffect(() => {
    if (!socketRef.current) {
      // Создаём подключение к серверу через сокет
      socketRef.current = io(SERVER_URI, {
        query: {
          roomId: currentRoomId,
          userName: user?.name,
        },
      });

      // Отправляем данные пользователя при подключении (только 1 раз)
      socketRef.current.emit('user:add', { ...user, roomId: currentRoomId });

      // Инициализация получения данных от сервера
      socketRef.current.emit('message:get'); // Получение сообщений
      socketRef.current.emit('room_list:get'); // Получение списка комнат

      // Слушатели данных от сервера
      socketRef.current.on('log', setLog);
      socketRef.current.on('user_list:update', (serverUsers) => {
        // Удаляем дубликаты пользователей
        const uniqueUsers = serverUsers.filter((value, index, self) => {
          return index === self.findIndex(user => user.name === value.name); // Сравнение по имени
        });
        setUsers(uniqueUsers);
      });

      socketRef.current.on('message_list:update', setAllMessages); // Обновляем все полученные сообщения
      socketRef.current.on('room_list:update', setRooms); // Обновляем список комнат

      // Обработка события "room:joined" (переподключение пользователя)
      socketRef.current.on('room:joined', (roomName) => {
        const updatedUser = { ...user, roomId: roomName };
        setUser(updatedUser);
        storage.set(USER_KEY, updatedUser); // Сохраняем обновлённые данные
        window.location.reload(); // Перезагрузка страницы
      });
    }

    // Загружаем данные о специализации пользователя
    fetchUserSpecialization();

    // Очистка сокета и событий при размонтировании
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect(); // Отключаем соединение
        socketRef.current = null; // Сбрасываем сокет
      }
    };
  }, [currentRoomId]); // Выполняем эффект при изменении текущей комнаты

  // Отправка сообщения
  const sendMessage = (message) => {
    socketRef.current.emit('message:add', message);
  };

  // Удаление сообщения
  const removeMessage = (message) => {
    socketRef.current.emit('message:remove', message);
  };

  // Создание комнаты
  const createRoom = (roomName) => {
    socketRef.current.emit('room:create', roomName);
  };

  // Присоединение к комнате
  const joinRoom = (roomName) => {
    const updatedUser = { ...user, roomId: roomName };
    setUser(updatedUser);
    storage.set(USER_KEY, updatedUser); // Обновляем данные пользователя
    socketRef.current.emit('room:join', roomName); // Отправляем событие для подключения к комнате
  };

  // Сообщения только для текущей комнаты
  const messages = allMessages.filter((msg) => msg.roomId === currentRoomId);

  return {
    // Возвращаем состояния и методы
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