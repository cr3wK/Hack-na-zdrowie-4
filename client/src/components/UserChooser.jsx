import React, { useEffect, useState } from 'react';
import axios from 'axios';
import storage from 'utils/storage';
import { USER_KEY } from 'constants';

export const UserChooser = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Загрузка пользователей из API
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                setUsers(response.data); // Установка данных пользователей
                setLoading(false);
            } catch (err) {
                console.error('Ошибка при загрузке пользователей:', err);
                setError('Не удалось загрузить список пользователей');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSelection = (e) => {
        setSelectedUserId(e.target.value);
    };

    const handleLogin = () => {
        const selectedUser = users.find((user) => user._id === selectedUserId);

        if (selectedUser) {
            // Сохранение данных пользователя в localStorage
            storage.set(USER_KEY, {
                userId: selectedUser._id,
                userName: selectedUser.userName,
                roomId: selectedUser.roomId || 'main_room',
            });

            // Перезагрузка для применения изменений
            window.location.reload();
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h3>Выберите пользователя</h3>
            <select value={selectedUserId} onChange={handleSelection}>
                <option value="">Выберите...</option>
                {users.map((user) => (
                    <option key={user._id} value={user._id}>
                        {user.userName}
                    </option>
                ))}
            </select>
            <button onClick={handleLogin} disabled={!selectedUserId}>
                Войти
            </button>
        </div>
    );
};