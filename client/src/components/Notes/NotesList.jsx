import React from 'react';
import NoteItem from './NoteItem';
import './notesList.css';

const NotesList = ({ notes, deleteNote }) => {
    return (
        <ul className="notes-list">
            {notes.length > 0 ? (
                notes.map((note) => (
                    <NoteItem
                        key={note.id}
                        note={note}
                        deleteNote={deleteNote}
                    />
                ))
            ) : (
                <p className="no-notes">No notes added yet.</p>
            )}
        </ul>
    );
};

export default NotesList;