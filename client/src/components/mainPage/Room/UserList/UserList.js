import React, { useState, useEffect } from 'react';
import { AiOutlineUser } from 'react-icons/ai';

const colors = ['#0275d8', '#5cb85c', '#f0ad4e', '#d9534f', '#292b2c']; // Цветовая палитра

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export default function UserList({ users, onUserClick }) {
    const [userColors, setUserColors] = useState({}); // Словарь с фиксированными цветами

    useEffect(() => {
        // Генерация цветов для новых пользователей
        const newColors = {};
        users.forEach(({ userId }) => {
            if (!userColors[userId]) {
                newColors[userId] = getRandomColor(); // Присваиваем случайный цвет
            }
        });
        setUserColors((prevColors) => ({ ...prevColors, ...newColors }));
    }, [users]); // Обновляется только при изменении списка пользователей

    return (
        <div className="container user">
            <h2>Użytkowniki</h2>
            <ul className="list user">
                {users.map(({ userId, userName }) => (
                    <li
                        key={userId}
                        className="item user"
                        onClick={() => onUserClick(users.find(user => user.userId === userId))}
                    >
                        {/* Точка состояния с фиксированным цветом */}
                        <div
                            className="status-dot"
                            style={{backgroundColor: userColors[userId]}}
                        ></div>

                        {/* Имя пользователя с фиксированным цветом */}
                        <span
                            className="user-link"
                            style={{color: userColors[userId]}}
                        >
                            {userName}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}