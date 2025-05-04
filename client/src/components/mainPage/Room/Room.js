import { useEffect, useState } from 'react'
import useChat from 'hooks/useChat'
import MessageInput from './MessageInput/MessageInput'
import MessageList from './MessageList/MessageList'
import UserList from './UserList/UserList'
import { UserChooser } from '../../UserChooser'
import { MainPage } from 'components/mainPage/MainPage'
import { CalendarComponent } from 'components/calendar/CalendarComponent'
import { useNavigate, useParams } from 'react-router-dom'

export const Room = () => {
    const { roomId } = useParams()
    const { users, messages, log, sendMessage, removeMessage } = useChat(roomId) // Здесь allMessages передаются
    const [selectedUser, setSelectedUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        // Переключение между комнатами
        if (roomId) {
            navigate(`/room/${roomId}`)
        }
    }, [roomId])

    const handleUserClick = (user) => {
        setSelectedUser({
            userId: user.userId || user.id,
            userName: user.userName || user.name || 'Guest',
        })
    }

    const closeUserPanel = () => setSelectedUser(null)

    // Фильтрация сообщений по roomId на клиенте
    const filteredMessages = messages.filter((message) => message.roomId === roomId)

    return (
        <div className="container chat">
            <CalendarComponent />
            <UserChooser />
            <div className="container message">
                <MessageList log={log} messages={filteredMessages} removeMessage={removeMessage} />
                <MessageInput sendMessage={sendMessage} />
            </div>
            <UserList users={users} onUserClick={handleUserClick} />
            {selectedUser && (
                <MainPage userId={selectedUser.userId} userName={selectedUser.userName} onClose={closeUserPanel} />
            )}
        </div>
    )
}
