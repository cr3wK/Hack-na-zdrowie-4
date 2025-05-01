import React, { useState } from 'react';
import useChat from 'hooks/useChat';
import MessageInput from './MessageInput/MessageInput';
import MessageList from './MessageList/MessageList';
import UserList from './UserList/UserList';
import { MainPage } from 'components/mainPage/MainPage';
import { CalendarComponent } from 'components/calendar/CalendarComponent';

export const Room = () => {
    const { users, messages, log, sendMessage, removeMessage } = useChat();
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUserClick = (user) => {
        setSelectedUser({
            userId: user.userId || user.id,
            userName: user.userName || user.name || 'Guest',
            specialization: user.specialization,
            allPatients: user.allPatients || [],
            surname: user.surname// Передаём список пациентов
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
                    surname={selectedUser.surname} // Фамилия пациента/доктора
                    specialization={selectedUser.specialization} // Специализация: 'doctor' или 'patient'
                    patients={selectedUser.specialization === 'doctor' ? selectedUser.allPatients : []} // Список видят только доктора
                    onClose={closeUserPanel}
                />
            )}

        </div>
    );
};