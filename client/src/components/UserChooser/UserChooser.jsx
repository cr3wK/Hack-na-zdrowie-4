import React, { useEffect, useState } from 'react';
import storage from 'utils/storage';
import { USER_KEY } from 'constants';
import { useNavigate } from 'react-router-dom';
import useChat from 'hooks/useChat';
import './userChooser.css';

export const UserChooser = () => {
    const user = storage.get(USER_KEY);
    const navigate = useNavigate();
    const { joinRoom } = useChat();

    const [roomsDetails, setRoomsDetails] = useState([]);
    const [searchPesel, setSearchPesel] = useState('');
    const [error, setError] = useState(null);

    // Функция получения данных комнаты
    const fetchRoomDetails = async (roomId) => {
        try {
            const response = await fetch(`http://localhost:4000/room/${roomId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch room details for ID: ${roomId}`);
            }

            const data = await response.json();
            return {
                id: roomId,
                doctorName: data.doctor?.name || "Unknown Doctor",
                patientName: data.patient?.name || "Unknown Patient",
                patientPesel: data.patient?.pesel || "Unknown PESEL"
            };
        } catch (error) {
            console.error(`Error fetching room details (ID: ${roomId}):`, error);
            return { id: roomId, doctorName: "Error", patientName: "Error", patientPesel: "Error" };
        }
    };

    // Загружаем данные комнат при первом отображении компонента
    useEffect(() => {
        const fetchAllRoomsData = async () => {
            if (!user?.allRoomIds || user.allRoomIds.length === 0) {
                setError("You don't have access to any chats.");
                return;
            }

            try {
                const roomDetails = await Promise.all(
                    user.allRoomIds.map((roomId) => fetchRoomDetails(roomId))
                );
                setRoomsDetails(roomDetails); // Изначально отображаем все комнаты
            } catch (err) {
                setError("Error while loading room data.");
                console.error("Ошибка загрузки данных комнат:", err);
            }
        };

        fetchAllRoomsData();
    }, [user]);

    if (!user) {
        return <h1>Error</h1>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    // Фильтруем комнаты в момент рендера
    const filteredRooms = roomsDetails.filter((room) =>
        searchPesel.trim() === '' || room.patientPesel.toLowerCase().includes(searchPesel.toLowerCase())
    );

    const handleRoomSelect = (roomId) => {
        joinRoom(roomId); // отправляем на сервер
        navigate(`/room/${roomId}`); // обновляем URL
    };

    return (
        <div className="user-chooser">
            <h2 className="title">Chats</h2>
            <div className="search-box">
                <label htmlFor="pesel-search">Search by PESEL:</label>
                <input
                    type="text"
                    id="pesel-search"
                    value={searchPesel}
                    onChange={(e) => setSearchPesel(e.target.value)}
                    placeholder="Enter patient PESEL"
                />
            </div>
            {filteredRooms.length > 0 ? (
                <ul className="user-option-list">
                    {filteredRooms.map((room) => (
                        <li
                            key={room.id}
                            className="user-option"
                            onClick={() => handleRoomSelect(room.id)}
                        >
                            <div className="user-info">
                                <span className="doctor">Doctor: {room.doctorName}</span>
                                {' | '}
                                <span className="patient">
                                    Patient: {room.patientName}
                                    {' | '}
                                    Numer PESEL: {room.patientPesel}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nie masz czatów.</p>
            )}
        </div>
    );
};