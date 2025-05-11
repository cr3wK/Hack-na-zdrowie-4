import React, { useState, useEffect } from 'react';
import './medicalHistory.css';
import { format, parse } from 'date-fns';

const MedicalHistory = ({ userId }) => {
    const [illness, setIllness] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Получение данных от сервера
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
                console.log(data);
                setIllness(data.illnessDescription || 'No illness history available');
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error fetching data');
                setIllness('');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchMedicalHistory();
        }
    }, [userId]);

    if (loading) {
        return <p className="medical-history-loading">Loading medical history...</p>;
    }

    if (error) {
        return <p className="medical-history-error">Error: {error}</p>;
    }

    // Парсинг строки медицинской истории
    const parseIllnessData = (text) => {
        // Регулярное выражение для поиска дат
        const dateRegex = /(\d{4}-\d{2}-\d{2})|(\d{1,2} [A-Za-z]{3} \d{4})|(\d{2}\.\d{2}\.\d{4})/g;

        let match;
        const result = [];
        let lastIndex = 0;

        // Находим даты и формируем частичные строки
        while ((match = dateRegex.exec(text)) !== null) {
            // Если между последним найденным индексом и текущей датой была информация
            if (lastIndex < match.index) {
                const entryText = text.slice(lastIndex, match.index).trim();
                if (entryText) {
                    result.push(entryText); // Добавляем остаток текста перед новой датой
                }
            }

            // Преобразование даты
            let date = match[0];
            if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                date = format(parse(date, 'yyyy-MM-dd', new Date()), 'dd.MM.yyyy');
            } else if (/^\d{1,2} [A-Za-z]{3} \d{4}$/.test(date)) {
                date = format(parse(date, 'dd MMM yyyy', new Date()), 'dd.MM.yyyy');
            }

            // Добавляем дату в массив
            result.push(date);
            lastIndex = dateRegex.lastIndex; // Обновляем текущую позицию
        }

        // Добавляем остаток текста (после последней даты)
        if (lastIndex < text.length) {
            const remainingText = text.slice(lastIndex).trim();
            if (remainingText) {
                result.push(remainingText);
            }
        }

        // Собираем результат в формате "Дата - Описание"
        const formattedResult = [];
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            const nextItem = result[i + 1] || ''; // Текст после даты
            if (/\d{2}\.\d{2}\.\d{4}/.test(item)) {
                formattedResult.push(`${item} - ${nextItem}`);
                i++; // Пропускаем следующий элемент, так как он уже добавлен
            }
        }

        return formattedResult;
    };

    // Отформатированная медицинская история
    const formattedIllnesses = parseIllnessData(illness);

    return (
        <>
            <button className="medical-history-button" onClick={() => setIsModalOpen(true)}>
                Otwórz historię medyczną
            </button>

            {isModalOpen && (
                <div className="medical-history-modal">
                    <div className="medical-history-modal-content">
                        <button
                            className="medical-history-modal-close"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✖
                        </button>
                        <h2 className="medical-history-modal-title">
                            Historia medyczna</h2>

                        {/* Выводим данные в виде списка */}
                        {formattedIllnesses.length > 0 ? (
                            <ul className="medical-history-list">
                                {formattedIllnesses.map((item, index) => (
                                    <li key={index} className="medical-history-item">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Brak dostępnej historii medycznej.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default MedicalHistory;