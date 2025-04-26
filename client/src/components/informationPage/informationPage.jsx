import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const InformationPage = () => {
    const { userId } = useParams(); // Берем ID из URL
    const [userInfo, setUserInfo] = useState(null);
    const [isDoctor, setIsDoctor] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Проверяем, авторизован ли пользователь, как доктор
                const doctorResponse = await axios.get('/doctor/me', { withCredentials: true });
                if (doctorResponse.data) {
                    setUserInfo(doctorResponse.data);
                    setIsDoctor(true);
                } else {
                    // Если пользователь не доктор, загружаем пациента
                    const patientResponse = await axios.get(`/patient/${userId}`, { withCredentials: true });
                    setUserInfo(patientResponse.data);
                }
            } catch (err) {
                console.error("Ошибка при загрузке данных:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    if (loading) return <div>Загрузка...</div>;

    if (!userInfo) return <div>Пользователь не найден</div>;

    return (
        <div>
            {isDoctor ? (
                <div>
                    <h1>Информация о докторе</h1>
                    <p>Имя: {userInfo.name}</p>
                    <p>Фамилия: {userInfo.surname}</p>
                    <p>Специализация: {userInfo.specialization}</p>
                </div>
            ) : (
                <div>
                    <h1>Информация о пациенте</h1>
                    <p>Имя: {userInfo.name}</p>
                    <p>Фамилия: {userInfo.surname}</p>
                    <p>Описание болезни: {userInfo.illnessDescription || "Нет описания"}</p>
                </div>
            )}
        </div>
    );
};

export default InformationPage;