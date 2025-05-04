import React, { useState, useEffect } from 'react';
import './medications.css';

const Medications = ({ userId }) => {
    const [medications, setMedications] = useState([]); // Лекарства в виде массива
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [error, setError] = useState(null); // Состояние ошибки
    const [isModalOpen, setIsModalOpen] = useState(false); // Управляет отображением модального окна

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
                setMedications(data.drugs || []); // Ожидаем medications как массив
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
            {/* Кнопка для открытия списка медикаментов */}
            <button className="medications-button" onClick={() => setIsModalOpen(true)}>
                Show Medications
            </button>

            {/* Модальное окно с лекарствами */}
            {isModalOpen && (
                <div className="medications-modal">
                    <div className="medications-modal-content">
                        <button
                            className="medications-modal-close"
                            onClick={() => setIsModalOpen(false)}>
                            ✖
                        </button>
                        <h2 className="medications-title">Your Medications</h2>
                        <ul className="medications-list">
                            {medications.map((medication, index) => (
                                <li key={index} className="medications-item">
                                    <p>
                                        <strong>Name:</strong> {medication.name}
                                    </p>
                                    <p>
                                        <strong>Description:</strong> {medication.description}
                                    </p>
                                    <p>
                                        <strong>Dosage:</strong> {medication.dosage}
                                    </p>
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