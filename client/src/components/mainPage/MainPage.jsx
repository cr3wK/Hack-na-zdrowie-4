import React, { useState, useEffect } from 'react';
import PulseStatus from 'components/PulseStatus/PulseStatus'; // Path to PulseStatus component
import Notes from 'components/Notes/Notes'; // Path to Notes component
import './mainPage.css';

export function MainPage({ userId, userName = 'Guest', specialization = '', patients = [], onClose }) {
    const [bpm, setBpm] = useState(72); // Default bpm value, simulated as dynamic
    const [patientNames, setPatientNames] = useState([]); // State for patient names

    // Simulate pulse updates every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBpm((prevBpm) => Math.max(60, Math.min(100, prevBpm + (Math.random() * 10 - 5)))); // Random bpm within bounds
        }, 5000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    // Fetch name for a specific patient ID
    const fetchPatientName = async (patientId) => {
        try {
            const response = await fetch(`http://localhost:4000/patient/${patientId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch patient name for ID: ${patientId}`);
            }

            const data = await response.json();
            return data.name || 'Unknown'; // Use name or fallback to "Unknown"
        } catch (error) {
            console.error(`Error fetching patient name for ID ${patientId}:`, error);
            return 'Error fetching patient name'; // Fallback for error case
        }
    };

    useEffect(() => {
        const fetchPatients = async () => {
            if (patients.length) {
                const validIds = patients.filter((id) => id); // Filter valid IDs
                const fetchedNames = await Promise.all(
                    validIds.map((id) => fetchPatientName(id)) // Fetch names for each ID
                );
                setPatientNames(fetchedNames);
            } else {
                setPatientNames([]); // If there are no patients, set empty array
            }
        };

        fetchPatients();
    }, [patients]);

    // Determine the welcome message based on specialization
    const getWelcomeMessage = () => {
        if (specialization.toLowerCase() === 'doctor') {
            return `Welcome, Dr. ${userName || 'Guest'}!`;
        }
        return `Good day, ${userName || 'Guest'}!`;
    };

    return (
        <div className="main-page-overlay">
            <div className="main-page">
                {/* Close Button */}
                <button className="main-page-close-btn" onClick={onClose}>
                    ✖
                </button>

                {/* Welcome Message */}
                <h1 className="main-page-title">{getWelcomeMessage()}</h1>

                {/* User ID (conditionally display) */}
                {userId && (
                    <p className="main-page-user-id">
                        <strong>User ID:</strong> {userId}
                    </p>
                )}

                {/* Specialization (conditionally display, only if non-empty) */}
                {specialization && (
                    <p className="main-page-specialization">
                        <strong>Specialization:</strong> {specialization}
                    </p>
                )}

                {/* Description */}
                <p className="main-page-description">
                    Here you can manage all your tasks and monitor user's vitals.
                </p>

                {/* Pulse Status (conditionally display based on specialization) */}
                {!specialization && (
                    <section className="pulse-section">
                        <h2 className="section-title">Pulse Status</h2>
                        <PulseStatus bpm={bpm} />
                    </section>
                )}

                {/* Patients Section (conditionally display if there are patients) */}
                {patientNames.length > 0 && (
                    <section className="DoctorsPatients">
                        <h2 className="section-title">Patients:</h2>
                        <ul>
                            {patientNames.map((name, index) => (
                                <li key={index}>
                                    <strong>{index + 1}</strong>. {name}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Notes Section (conditionally display if userId exists) */}
                {userId && (
                    <section className="notes-section">
                        <h2 className="section-title">Your Notes</h2>
                        <Notes userId={userId} />
                    </section>
                )}
            </div>
        </div>
    );
}