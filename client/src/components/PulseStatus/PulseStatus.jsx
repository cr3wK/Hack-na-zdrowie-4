import React, { useEffect, useState } from 'react';
import './pulseStatus.css';
import { FaHeart } from 'react-icons/fa';

const PulseStatus = ({ bpm = 72 }) => {
    const [isBeating, setIsBeating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsBeating((prev) => !prev);
        }, 500); // Пульсация каждые 500ms
        return () => clearInterval(interval);
    }, []);

    // Функция округления значения пульса до целого
    const roundedBpm = Math.round(bpm);

    return (
        <div className="pulse-status">
            <FaHeart
                className={`pulse-heart ${isBeating ? 'pulse-beat' : ''}`}
            />
            <span className="pulse-text">{roundedBpm} BPM</span> {/* Здесь работает округление */}
        </div>
    );
};

export default PulseStatus;