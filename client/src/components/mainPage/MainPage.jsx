import React from 'react';
import PulseStatus from 'components/PulseStatus/PulseStatus'; // Убедитесь, что путь правильный
import Notes from 'components/Notes/Notes'; // Модуль Notes
import './mainPage.css';

export function MainPage({ userId, userName = 'Guest', onClose }) {
    return (
        <div className="main-page-overlay"> {/* Затемняющее окно */}
            <div className="main-page">
                {/* Кнопка закрытия */}
                <button className="main-page-close-btn" onClick={onClose}>✖</button>

                {/* Заголовок и описание */}
                <h1 className="main-page-title">Welcome, {userName || 'Guest'}!</h1>
                {userId && <p>User ID: {userId}</p>}
                <p className="main-page-description">Here you can manage all your tasks.</p>

                {/* Пульс */}
                <PulseStatus bpm={72}/> {/* Добавлено обратно */}

                {/* Заметки */}
                <Notes/>
            </div>
        </div>
    );
}