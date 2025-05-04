import React from 'react';
import storage from 'utils/storage';
import { USER_KEY } from 'constants';
import { useNavigate } from 'react-router-dom';

export const UserChooser = () => {
    const user = storage.get(USER_KEY);
    const navigate = useNavigate();
    console.log(user);
    if (!user) {
        return <h1>Error</h1>;
    }

    const handleRoomSelect = (roomId) => {
        console.log(`room: ${roomId}`);
        user.roomId = roomId;
        storage.set(USER_KEY, user);
        navigate(`/room/${roomId}`);
    };

    return (
        <div>
            <h2>Select chat:</h2>
            {user.roomIds && user.roomIds.length > 0 ? (
                user.roomIds.map((roomId) => (
                    <p key={roomId}>
                        <button onClick={() => handleRoomSelect(roomId)}>
                            {user.name} —  {roomId}
                        </button>
                    </p>
                ))
            ) : (
                <p>You don't have chats yet</p>
            )}
        </div>
    );
};
