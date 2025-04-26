import React from 'react';
import './noteItem.css';

const NoteItem = ({ note, deleteNote }) => {
    const handleDelete = () => {
        deleteNote(note.id); // Удаляем заметку по ID
    };

    return (
        <li className="note-item">
            <span>{note.text}</span>
            <button className="delete-btn" onClick={handleDelete}>
                ✖
            </button>
        </li>
    );
};

export default NoteItem;