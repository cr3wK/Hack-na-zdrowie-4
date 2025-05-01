import React, { useState, useEffect } from 'react';
import NotesInput from './NotesInput';
import NotesList from './NotesList';
import './notes.css';

const Notes = ({ userId }) => {
    const [notes, setNotes] = useState([]);

    // Локальная функция для генерации ключа заметок, основанного на userId
    const getStorageKey = () => `notes_${userId}`;

    // Загрузка заметок для текущего userId при монтировании компонента
    useEffect(() => {
        if (!userId) return; // Если userId отсутствует, ничего не делаем
        const savedNotes = localStorage.getItem(getStorageKey()); // Получаем заметки для userId
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes)); // Парсим и добавляем в состояние
        }
    }, [userId]);

    // Сохранение заметок для текущего userId
    useEffect(() => {
        if (!userId) return; // Если userId отсутствует, ничего не делаем
        localStorage.setItem(getStorageKey(), JSON.stringify(notes)); // Сохраняем заметки с ключом, привязанным к userId
    }, [userId, notes]);

    // Добавление новой заметки
    const addNote = (text) => {
        if (text.trim()) {
            const newNote = {
                id: Date.now(), // Уникальный ID
                text: text.trim(),
            };
            setNotes((prevNotes) => [...prevNotes, newNote]);
        }
    };

    // Удаление заметки
    const deleteNote = (id) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    };

    return (
        <div className="notes">
            <h2>Notes</h2>
            {userId ? (
                <>
                    <NotesInput addNote={addNote} />
                    <NotesList notes={notes} deleteNote={deleteNote} />
                </>
            ) : (
                <p>Please log in to manage your notes.</p>
            )}
        </div>
    );
};

export default Notes;