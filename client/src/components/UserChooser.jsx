import React, { useState } from 'react';
import './userChooser.css'; // Стили компонента

export const UserChooser = ({ users = [], onUserSelect }) => {
    const [selectedUserId, setSelectedUserId] = useState(null); // ID выбранного пользователя

    // Обработчик выбора пользователя
    const handleUserSelection = (user) => {
        setSelectedUserId(user.userId || user.id); // Устанавливаем выбранного пользователя
        if (onUserSelect) {
            onUserSelect(user); // Передаем данные выбранного пользователя
        }
    };

    return (
        <div className="user-chooser">
            <h3>Список пользователей</h3>
            <ul className="user-chooser-list">
                {users.map((user) => (
                    <li
                        key={user.userId || user.id}
                        className={`user-chooser-item ${user.userId === selectedUserId ? 'active' : ''}`}
                        onClick={() => handleUserSelection(user)}
                    >
                        {user.name} {user.surname} {/* Имя и фамилия пользователя */}
                    </li>
                ))}
            </ul>
        </div>
    );
};