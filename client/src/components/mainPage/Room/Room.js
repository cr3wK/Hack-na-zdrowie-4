import React, { useState } from 'react';
import useChat from 'hooks/useChat';
import MessageInput from './MessageInput/MessageInput';
import MessageList from './MessageList/MessageList';
import UserList from './UserList/UserList';
import { MainPage } from 'components/mainPage/MainPage';
import { CalendarComponent } from 'components/calendar/CalendarComponent';

export const Room = () => {
    const { users, messages, log, sendMessage, removeMessage } = useChat(); // Убрали user
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUserClick = (user) => {
        setSelectedUser({
            userId: user.userId || user.id,
            userName: user.userName || user.name || 'Guest',
            specialization: user.specialization
        });
    };

    const closeUserPanel = () => setSelectedUser(null);

    return (
        <div className="container chat">
            {/* Календарь */}
            <CalendarComponent />

            {/* Сообщения */}
            <div className="container message">
                <MessageList log={log} messages={messages} removeMessage={removeMessage} />
                <MessageInput sendMessage={sendMessage} />
            </div>

            {/* Список пользователей */}
            <UserList users={users} onUserClick={handleUserClick} />

            {/* Информация о выбранном пользователе */}
            {selectedUser && (
                <MainPage
                    userId={selectedUser.userId}
                    userName={selectedUser.userName}
                    onClose={closeUserPanel}
                />
            )}
        </div>
    );
};