import React, { useState, useEffect } from 'react';
import PulseStatus from 'components/PulseStatus/PulseStatus'; // Ensure the path is correct
import Notes from 'components/Notes/Notes'; // Link Notes component
import './mainPage.css';

export function MainPage({ userId, userName = 'Guest', specialization = 'Unknown', onClose }) {
    const [bpm, setBpm] = useState(72); // Default bpm value, simulated as dynamic

    // Simulate pulse updates every 5 seconds (mocking real health monitor data)
    useEffect(() => {
        const interval = setInterval(() => {
            setBpm((prevBpm) => Math.max(60, Math.min(100, prevBpm + (Math.random() * 10 - 5)))); // Random bpm with bounds
        }, 5000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return (
        <div className="main-page-overlay">
            <div className="main-page">
                {/* Close Button */}
                <button className="main-page-close-btn" onClick={onClose}>
                    ✖
                </button>

                {/* Title and Description */}
                <h1 className="main-page-title">Welcome, Dr. {userName || 'Guest'}!</h1>
                {userId && <p className="main-page-user-id">User ID: {userId}</p>}

                {/* Specialization */}
                <p className="main-page-specialization">
                    <strong>Specialization:</strong> {specialization}
                </p>

                <p className="main-page-description">
                    Here you can manage all your tasks and monitor user's vitals.
                </p>

                {/* Pulse Status */}
                <section className="pulse-section">
                    <h2 className="section-title">Pulse Status</h2>
                    <PulseStatus bpm={bpm} />
                </section>

                {/* Notes Section */}
                <section className="notes-section">
                    <h2 className="section-title">Your Notes</h2>
                    <Notes userId={userId} />
                </section>
            </div>
        </div>
    );
}