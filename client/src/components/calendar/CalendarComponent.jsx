import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendarComponent.css";

export const CalendarComponent = () => {
    const [date, setDate] = useState(new Date()); // Хранит выбранную дату
    const [events, setEvents] = useState([]); // Список всех событий
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
        const eventTitle = prompt("Enter event title:");
        if (eventTitle && eventTitle.trim() !== "") {
            const newEvent = { date: date.toDateString(), title: eventTitle.trim() };
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        }
    };

    // Удаление события
    const handleDeleteEvent = (eventToDelete) => {
        const updatedEvents = events.filter((event) => JSON.stringify(event) !== JSON.stringify(eventToDelete));
        setEvents(updatedEvents);
    };

    // События для выбранного дня
    const eventsForDay = events.filter((event) => event.date === date.toDateString());

    // Подсветка дней с событиями
    const addClassToEvents = ({ date, view }) => {
        if (view === "month") {
            const eventDay = events.some((event) => event.date === date.toDateString());
            return eventDay ? "highlight-day" : null;
        }
    };

    return (
        <div className="calendar-wrapper">
            {/* Кнопка открытия календаря */}
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
                        onChange={(selectedDate) => setDate(selectedDate)} // Установить выбранную дату
                        value={date}
                        locale="en-US"
                        tileClassName={addClassToEvents} // Добавляем подсветку
                    />

                    {/* Добавить событие */}
                    <button className="add-event-btn" onClick={handleAddEvent}>
                        +
                    </button>

                    {/* События выбранного дня */}
                    <div>
                        <h3>Events for {date.toDateString()}:</h3>
                        {eventsForDay.length > 0 ? (
                            <ul className="events-list">
                                {eventsForDay.map((event, i) => (
                                    <li key={i}>
                                        {event.title}
                                        <button
                                            className="delete-event-btn"
                                            onClick={() => handleDeleteEvent(event)}
                                        >
                                            🗑
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No events for this day</p>
                        )}
                    </div>

                    {/* Общий список событий */}
                    {events.length > 0 && (
                        <div className="all-events-container">
                            <h3>All Events:</h3>
                            <ul className="all-events-list">
                                {events.map((event, i) => (
                                    <li key={i}>
                                        <strong>{event.date}</strong>: {event.title}
                                        <button
                                            className="delete-event-btn"
                                            onClick={() => handleDeleteEvent(event)}
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