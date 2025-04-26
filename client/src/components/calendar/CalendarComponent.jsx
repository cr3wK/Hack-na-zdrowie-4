import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendarComponent.css";

export const CalendarComponent = () => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false); // Состояние видимости календаря

    // Загрузка событий из localStorage
    useEffect(() => {
        const savedEvents = JSON.parse(localStorage.getItem("calendar-events") || "[]");
        setEvents(savedEvents);
    }, []);

    // Сохранение событий в localStorage
    useEffect(() => {
        localStorage.setItem("calendar-events", JSON.stringify(events));
    }, [events]);

    const handleAddEvent = () => {
        const eventTitle = prompt("Добавить событие:");
        if (eventTitle && eventTitle.trim() !== "") {
            const newEvent = { date: date.toDateString(), title: eventTitle.trim() };
            setEvents([...events, newEvent]);
        }
    };

    const eventsForDay = events.filter((event) => event.date === date.toDateString());

    return (
        <div className="calendar-wrapper">
            {/* Иконка-кнопка для отображения календаря */}
            <button className="calendar-icon-btn" onClick={() => setIsCalendarVisible(!isCalendarVisible)}>
                📅
            </button>

            {/* Календарь появляется при клике */}
            {isCalendarVisible && (
                <div className="calendar-container">
                    <Calendar onChange={setDate} value={date} locale="ru-RU" />
                    <button className="add-event-btn" onClick={handleAddEvent}>
                        +
                    </button>
                    {eventsForDay.length > 0 && (
                        <ul className="events-list">
                            {eventsForDay.map((event, i) => (
                                <li key={i}>{event.title}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};