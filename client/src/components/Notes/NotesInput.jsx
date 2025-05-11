import React, { useState } from 'react';
import './notesInput.css';

const NotesInput = ({ addNote }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addNote(text); // Добавляем заметку
        setText(''); // Очищаем поле ввода
    };

    return (
        <form className="notes-input" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Napisz notatkę..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
            />
            <button type="submit">+</button>
        </form>
    );
};

export default NotesInput;