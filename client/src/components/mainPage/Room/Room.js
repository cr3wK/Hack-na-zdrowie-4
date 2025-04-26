import React, { useState } from 'react';
import useChat from 'hooks/useChat';
import MessageInput from './MessageInput/MessageInput';
import MessageList from './MessageList/MessageList';
import UserList from './UserList/UserList';
import { MainPage } from 'components/mainPage/MainPage';

export const Room = () => {
    const { users, messages, log, sendMessage, removeMessage } = useChat();
    const [selectedUser, setSelectedUser] = useState(null);

    // Обработчик клика по пользователю
    const handleUserClick = (user) => {
        console.log('User Clicked:', user); // Лог данных пользователя
        setSelectedUser({
            userId: user.userId || user.id, // Преобразование ключей
            userName: user.userName || user.name || 'Guest' // Имя или "Guest"
        });
    };

    // Закрытие модального окна
    const closeUserPanel = () => {
        console.log('Closing MainPage');
        setSelectedUser(null);
    };

    return (
        <div className="container chat">
            {/* Секция сообщений */}
            <div className="container message">
                <MessageList
                    log={log}
                    messages={messages}
                    removeMessage={removeMessage}
                />
                <MessageInput sendMessage={sendMessage} />
            </div>

            {/* Секция списка пользователей */}
            <UserList users={users} onUserClick={handleUserClick} />

            {/* Модальное окно с информацией о пользователе */}
            {selectedUser && (
                <MainPage
                    userId={selectedUser.userId} // Передаем userId
                    userName={selectedUser.userName} // Передаем userName
                    onClose={closeUserPanel} // Логика закрытия
                />
            )}

        </div>
    );
};