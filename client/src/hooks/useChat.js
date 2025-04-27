import { SERVER_URI, USER_KEY } from 'constants'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import storage from 'utils/storage'

export default function useChat() {
  // Получаем пользователя из локального хранилища
  const [user, setUser] = useState(storage.get(USER_KEY) || {})
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [log, setLog] = useState(null)
  const [rooms, setRooms] = useState([])

  const { current: socket } = useRef(
      io(SERVER_URI, {
        query: {
          roomId: user?.roomId,
          userName: user?.name
        }
      })
  )

  // Получение специализации пользователя из API
  const fetchUserSpecialization = async () => {
    try {
      const response = await fetch(`${SERVER_URI}/doctors/me`, {
        method: 'GET',
        credentials: 'include', // Делаем запрос с cookies
      })

      if (!response.ok) {
        console.error('Невозможно получить данные пользователя')
        return
      }

      const data = await response.json()

      // Обновляем данные пользователя (включая specialization)
      const updatedUser = {
        ...user,
        specialization: data.specialization // Добавляем специализацию
      }

      setUser(updatedUser)
      storage.set(USER_KEY, updatedUser) // Сохраняем данные в локальном хранилище
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error)
    }
  }

  useEffect(() => {
    // Загрузка специализации и инициализация сокета
    fetchUserSpecialization()

    console.log(socket)
    socket.emit('user:add', user)
    socket.emit('message:get')
    socket.emit('room_list:get')

    socket.on('log', setLog)
    socket.on('user_list:update', setUsers)
    socket.on('message_list:update', setMessages)
    socket.on('room_list:update', setRooms)
    socket.on('room:joined', (roomName) => {
      const updatedUser = { ...user, roomId: roomName }
      storage.set(USER_KEY, updatedUser)
      setUser(updatedUser) // Обновляем состояние пользователя
      window.location.reload()
    })

    return () => {
      socket.off('log')
      socket.off('user_list:update')
      socket.off('message_list:update')
      socket.off('room_list:update')
      socket.off('room:joined')
    }
  }, [])

  const sendMessage = (message) => socket.emit('message:add', message)
  const removeMessage = (message) => socket.emit('message:remove', message)

  const createRoom = (roomName) => socket.emit('room:create', roomName)
  const joinRoom = (roomName) => socket.emit('room:join', roomName)

  return {
    user, // Возвращаем объект user с новой информацией (включая specialization)
    users,
    messages,
    log,
    rooms,
    sendMessage,
    removeMessage,
    createRoom,
    joinRoom
  }
}