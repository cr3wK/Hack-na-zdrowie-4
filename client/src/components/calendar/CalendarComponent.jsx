import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendarComponent.css";

export const CalendarComponent = () => {
    const [date, setDate] = useState(new Date()); // Хранит выбранную дату
    const [events, setEvents] = useState([]); // Хранит список всех событий
    const [isCalendarVisible, setIsCalendarVisible] = useState(false); // Видимость календаря

    // Загрузка событий из localStorage при первом рендере
    useEffect(() => {
        const savedEvents = JSON.parse(localStorage.getItem("calendar-events") || "[]");
        setEvents(savedEvents);
    }, []);

    // Сохранение событий в localStorage при их изменении
    useEffect(() => {
        localStorage.setItem("calendar-events", JSON.stringify(events));
    }, [events]);

    // Добавление нового события
    const handleAddEvent = () => {
        const eventTitle = prompt("Add event:");
        if (eventTitle && eventTitle.trim() !== "") {
            const newEvent = { date: date.toDateString(), title: eventTitle.trim() };
            setEvents((prevEvents) => [...prevEvents, newEvent]); // Обновляем state с новым событием
        }
    };

    // Удаление события
    const handleDeleteEvent = (eventToDelete) => {
        const updatedEvents = events.filter(event => event !== eventToDelete); // Фильтруем событие
        setEvents(updatedEvents); // Обновляем state
    };

    // События для выбранного дня (пересчитываются каждый раз при изменении даты или event-ов)
    const eventsForDay = events.filter((event) => event.date === date.toDateString());

    // Добавляем CSS класс для подсветки дней с событиями
    const addClassToEvents = ({ date, view }) => {
        if (view === "month") {
            const eventDay = events.find((event) => event.date === date.toDateString());
            return eventDay ? "highlight-day" : null;
        }
    };

    return (
        <div className="calendar-wrapper">
            {/* Кнопка на главной для отображения календаря */}
            <button
                className="calendar-icon-btn"
                onClick={() => setIsCalendarVisible(!isCalendarVisible)}
            >
                📅
            </button>

            {/* Календарь */}
            {isCalendarVisible && (
                <div className="calendar-container">
                    <Calendar
                        onChange={(selectedDate) => {
                            setDate(selectedDate); // Установить выбранную дату
                        }}
                        value={date} // Выбранная дата
                        locale="en-US" // Устанавливаем язык на английский
                        tileClassName={addClassToEvents} // Подсвечиваем дни с событиями
                    />

                    {/* Кнопка добавления события */}
                    <button className="add-event-btn" onClick={handleAddEvent}>
                        +
                    </button>

                    {/* Список событий для выбранного дня */}
                    {eventsForDay.length > 0 && (
                        <ul className="events-list">
                            {eventsForDay.map((event, i) => (
                                <li key={i}>
                                    {event.title}
                                    <button
                                        className="delete-event-btn"
                                        onClick={() => handleDeleteEvent(event)} // Удалить событие
                                    >
                                        🗑
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Общий список всех событий */}
                    {events.length > 0 && (
                        <div className="all-events-container">
                            <h3>Your Events:</h3>
                            <ul className="all-events-list">
                                {events.map((event, i) => (
                                    <li key={i}>
                                        <strong>{event.date}</strong> — {event.title}
                                        <button
                                            className="delete-event-btn"
                                            onClick={() => handleDeleteEvent(event)} // Удалить событие из общего списка
                                        >
                                            🗑
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};