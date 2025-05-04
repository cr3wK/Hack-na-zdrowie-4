import React, { useState, useEffect } from 'react';
import './medicalHistory.css';

const MedicalHistory = ({ userId }) => {
    const [illness, setIllness] = useState(''); // Ожидается illness как строка
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Состояние ошибки
    const [isModalOpen, setIsModalOpen] = useState(false); // Управляет состоянием модального окна

    // Функция для получения illness из API
    useEffect(() => {
        const fetchMedicalHistory = async () => {
            try {
                const response = await fetch(`http://localhost:4000/patient/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch medical history');
                }

                const data = await response.json();
                console.log(data)
                setIllness(data.illnessDescription || 'No illness history available'); // Обновляем illness
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error fetching data');
                setIllness(''); // Очищаем illness в случае ошибки
            } finally {
                setLoading(false); // Завершаем загрузку
            }
        };

        if (userId) {
            fetchMedicalHistory(); // Вызываем функцию только если есть userId
        }
    }, [userId]);

    // Состояние загрузки
    if (loading) {
        return <p className="medical-history-loading">Loading medical history...</p>;
    }

    // Состояние ошибки
    if (error) {
        return <p className="medical-history-error">Error: {error}</p>;
    }

    return (
        <>
            {/* Кнопка для открытия модального окна */}
            <button className="medical-history-button" onClick={() => setIsModalOpen(true)}>
                Open Medical History
            </button>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="medical-history-modal">
                    <div className="medical-history-modal-content">
                        <button
                            className="medical-history-modal-close"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✖
                        </button>
                        <h2 className="medical-history-modal-title">Your Medical History</h2>
                        <p className="medical-history-modal-illness">{illness}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default MedicalHistory;