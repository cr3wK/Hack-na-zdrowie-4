import React, { useState, useEffect } from 'react';
import './medications.css';
import {format } from 'date-fns'
const Medications = ({ userId }) => {
    const [medications, setMedications] = useState([]); // Лекарства в виде массива
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Состояние ошибки
    const [isModalOpen, setIsModalOpen] = useState(false); // Управляет отображением модального окна
    const [visibleDescriptions, setVisibleDescriptions] = useState({}); // Управляет видимостью описаний

    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const response = await fetch(`http://localhost:4000/patient/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch medications');
                }

                const data = await response.json();
                console.log(data);
                setMedications(data.drugs || []); // Ожидаем drugs как массив
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error fetching medications');
                setMedications([]);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchMedications();
        }
    }, [userId]);

    // Хэндлер для управления показом/скрытием описания
    const toggleDescription = (id) => {
        setVisibleDescriptions((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    // Состояние загрузки
    if (loading) {
        return <p className="medications-loading">Loading medications...</p>;
    }

    // Состояние ошибки
    if (error) {
        return <p className="medications-error">Error: {error}</p>;
    }

    // Состояние, если список медикаментов пуст
    if (medications.length === 0) {
        return <p className="medications-empty">No medications available.</p>;
    }

    return (
        <>
            {/* Кнопка для открытия модального окна */}
            <button className="medications-button" onClick={() => setIsModalOpen(true)}>
                Pokaż leki
            </button>

            {/* Модальное окно с медикаментами */}
            {isModalOpen && (
                <div className="medications-modal">
                    <div className="medications-modal-content">
                        <button
                            className="medications-modal-close"
                            onClick={() => setIsModalOpen(false)}>
                            ✖
                        </button>
                        <h2 className="medications-title">Twoje leki</h2>
                        <ul className="medications-list">
                            {medications.map((medication) => (
                                <li key={medication._id} className="medications-item">
                                    <p><strong>Nazwa:</strong> {medication.name}</p>
                                    <button
                                        className="show-description-button"
                                        onClick={() => toggleDescription(medication._id)}>
                                        {visibleDescriptions[medication._id] ? 'Ukryj opis' : 'Pokaż opis'}
                                    </button>
                                    {visibleDescriptions[medication._id] && (
                                        <p>
                                            <strong>Opis:</strong> {medication.description}
                                            <br/>
                                            <strong>Dawka:</strong> {medication.dosage}
                                            <br/>
                                            <strong>Rozpoczęcie
                                                lekkow: </strong> {format(new Date(medication.dateOfStart), 'dd MMM yyyy, HH:mm')}
                                            <br/>
                                            <strong>Koniec
                                                lekkow: </strong> {format(new Date(medication.dateOfEnd), 'dd MMM yyyy, HH:mm')}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default Medications;