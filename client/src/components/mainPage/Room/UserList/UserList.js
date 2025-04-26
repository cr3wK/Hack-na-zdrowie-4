import { AiOutlineUser } from 'react-icons/ai';

export default function UserList({ users, onUserClick }) {
    return (
        <div className="container user">
            <h2>Users</h2>
            <ul className="list user">
                {users.map(({ userId, userName }) => (
                    <li
                        key={userId}
                        className="item user"
                        onClick={() => onUserClick({ id: userId, name: userName })} // Обрабатываем клик
                    >
                        <AiOutlineUser className="icon user" />
                        {/* Просто отображаем имя пользователя */}
                        <span className="user-link">{userName}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}