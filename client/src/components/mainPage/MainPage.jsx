import React, { useState, useEffect } from 'react';
import PulseStatus from 'components/PulseStatus/PulseStatus'; // Path to PulseStatus component
import Notes from 'components/Notes/Notes'; // Path to Notes component
import './mainPage.css';
import MedicalHistory from "../MedicalHistory/MedicalHistory";
import Medications from "../Medications/Medications";
export function MainPage({ userSurname,phoneNumber = 'number', userId, userName = 'Guest', specialization = '', patients = [], onClose }) {
    const [bpm, setBpm] = useState(72); // Default bpm value, simulated as dynamic
    const [patientData, setPatientData] = useState([]); // State for patient data including names and bartelScale

    // Simulate pulse updates every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBpm((prevBpm) => Math.max(60, Math.min(100, prevBpm + (Math.random() * 10 - 5)))); // Random bpm within bounds
        }, 5000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    // Fetch details (name and bartelScale) for a specific patient ID
    const fetchPatientDetails = async (patientId) => {
        try {
            const response = await fetch(`http://localhost:4000/patient/${patientId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch patient details for ID: ${patientId}`);
            }

            const data = await response.json();
            console.log(data);
            return {
                name: data.name || 'Unknown', // Use name or fallback to "Unknown"
                bartelScale: data.bartelScale || 0, // Use bartelScale or fallback to 0
            };
        } catch (error) {
            console.error(`Error fetching details for patient ID ${patientId}:`, error);
            return { name: 'Error fetching patient', bartelScale: 0 }; // Fallback for error case
        }
    };

    useEffect(() => {
        const fetchPatients = async () => {
            if (patients.length) {
                const validIds = patients.filter((id) => id); // Filter valid IDs
                const fetchedData = await Promise.all(
                    validIds.map((id) => fetchPatientDetails(id)) // Fetch name and bartelScale for each ID
                );
                setPatientData(fetchedData);
                console.log(fetchedData);
            } else {
                setPatientData([]);
                // If there are no patients, set empty array
            }
        };

        fetchPatients();
    }, [patients]);

    // Determine the welcome message based on specialization
    const getWelcomeMessage = () => {
        if (specialization.toLowerCase() === 'doctor') {
            return `Welcome, Dr. ${userName || 'Guest'}!`;
        }
        return ` ${userName || 'Guest'} ` + `${userSurname}`;
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
                {/* Phone Number */}
                {phoneNumber && (
                    <p className="user-phone-number">
                        <strong>Phone Number:</strong> {phoneNumber}
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
                {!specialization && (
                    <section className="illness-section">
                        <MedicalHistory userId={userId}/>
                    </section>

                )}
                {!specialization && (
                    <section className="medication-section">
                        <h2 className="section-title">Medications</h2>
                        <Medications userId={userId} />

                    </section>

                )}



                {/* Patients Section (conditionally display if there are patients) */}
                {patientData.map((patient, index) => (

                    <li key={index}>

                        <strong></strong> {patient.name}

                        <div className="bartel-scale">
                            <span className="bartel-scale-label">Barthel Scale:</span>
                            <div className="bartel-scale-bar">
                                <span style={{ width: `${patient.bartelScale}%` }}></span>
                            </div>
                            <span>{patient.bartelScale}</span>
                        </div>
                    </li>
                ))}

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