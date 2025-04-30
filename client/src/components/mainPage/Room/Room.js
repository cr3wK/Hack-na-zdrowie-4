import React, { useState, useEffect } from 'react';
import storage from '../../../utils/storage'
import {USER_KEY} from "../../../constants";
import useChat from 'hooks/useChat';
import MessageInput from './MessageInput/MessageInput';
import MessageList from './MessageList/MessageList';
import UserList from './UserList/UserList';
import {UserChooser} from '../../UserChooser';
import { MainPage } from 'components/mainPage/MainPage';
import { CalendarComponent } from 'components/calendar/CalendarComponent';
import {useNavigate, useParams} from "react-router-dom";

export const Room = () => {
    const { roomId } = useParams();
    const { users, messages, log, sendMessage, removeMessage } = useChat(roomId); // Убрали user
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (roomId) {
            navigate(`/room/${roomId}`);
        }
    }, [roomId]);

    const handleUserClick = (user) => {
        setSelectedUser({
            userId: user.userId || user.id,
            userName: user.userName || user.name || 'Guest',
        });
    };

    const closeUserPanel = () => setSelectedUser(null);
    const user = storage.get(USER_KEY);
    return (
        <div className="container chat">
            {/* Календарь */}
            <CalendarComponent />
            <UserChooser />
            {/* Сообщения */}
            <div className="container message">
                <MessageList log={log} messages={messages} removeMessage={removeMessage}/>
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