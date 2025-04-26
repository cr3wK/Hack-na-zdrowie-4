import { SERVER_URI, USER_KEY } from 'constants'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import storage from 'utils/storage'

export default function useChat() {
  const user = storage.get(USER_KEY)
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [log, setLog] = useState(null)
  const [rooms, setRooms] = useState([])

  const { current: socket } = useRef(
      io(SERVER_URI, {
        query: {
          roomId: user.roomId,
          userName: user.userName
        }
      })
  )

  useEffect(() => {
    socket.emit('user:add', user)
    socket.emit('message:get')
    socket.emit('room_list:get')

    socket.on('log', setLog)
    socket.on('user_list:update', setUsers)
    socket.on('message_list:update', setMessages)
    socket.on('room_list:update', setRooms)
    socket.on('room:joined', (roomName) => {
      storage.set(USER_KEY, { ...user, roomId: roomName })
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
