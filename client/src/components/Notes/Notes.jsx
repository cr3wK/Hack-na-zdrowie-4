import React, { useState } from 'react';
import NotesInput from './NotesInput';
import NotesList from './NotesList';
import './notes.css';

const Notes = () => {
    const [notes, setNotes] = useState([]);

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
            <NotesInput addNote={addNote} />
            <NotesList notes={notes} deleteNote={deleteNote} />
        </div>
    );
};

export default Notes;