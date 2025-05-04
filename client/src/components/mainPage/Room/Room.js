import React, { useState, useEffect } from 'react';
import useChat from 'hooks/useChat';
import MessageInput from './MessageInput/MessageInput';
import MessageList from './MessageList/MessageList';
import UserList from './UserList/UserList';
import { MainPage } from 'components/mainPage/MainPage';
import { CalendarComponent } from 'components/calendar/CalendarComponent';
import { useParams, useNavigate } from "react-router-dom";
import storage from "../../../utils/storage";
import {UserChooser} from "../../UserChooser/UserChooser";
import { USER_KEY } from "constants";

export const Room = () => {
    const { roomId } = useParams(); // Получаем roomId из параметров URL
    const navigate = useNavigate();

    // Проверяем, существует ли roomId. Передаём его в useChat только если оно определено.
    const { users, messages, log, sendMessage, removeMessage } = useChat(roomId || '');

    const [selectedUser, setSelectedUser] = useState(null);
    const user = storage.get(USER_KEY);

    useEffect(() => {
        // Если roomId изменяется, выполняем навигацию
        if (roomId) {
            navigate(`/room/${roomId}`);
        }
    }, [roomId]);

    const handleUserClick = (user) => {
        setSelectedUser({
            userId: user.userId || user.id,
            userName: user.userName || user.name || 'Guest',
            specialization: user.specialization,
            allPatients: user.allPatients || [],
            surname: user.surname,
            phoneNumber: user.phoneNumber
        });
    };

    const closeUserPanel = () => setSelectedUser(null);


    const filteredMessages = messages.filter((message) => message.roomId === roomId)
    // Ваша JSX-структура с переработкой message-container
    return (

        <div className="container chat">
            {/* Календарь */}
           <div>
               <CalendarComponent/>
               <UserChooser/>
           </div>

            {/* Сообщения */}
            <div className="container message">
                <MessageList log={log} messages={filteredMessages} removeMessage={removeMessage}/>
                <MessageInput sendMessage={sendMessage}/>


            </div>


            {/* Список пользователей */}

            <div className="right-panel">
                <UserList users={users} onUserClick={handleUserClick}/>

            </div>

            {/* Информация о выбранном пользователе */}
            {selectedUser && (
                <MainPage
                    userId={selectedUser.userId}
                    userName={selectedUser.userName}
                    surname={selectedUser.surname} // Фамилия пациента/доктора
                    specialization={selectedUser.specialization} // Специализация: 'doctor' или 'patient'
                    patients={selectedUser.specialization === 'doctor' ? selectedUser.allPatients : []}
                    phoneNumber={selectedUser.phoneNumber}// Список видят только доктора
                    onClose={closeUserPanel}
                />
            )}

        </div>
    );
};