import { useState } from 'react';
import { handleLogin } from './auth';
import { useNavigate } from 'react-router-dom';
import storage from 'utils/storage'
import { USER_KEY } from 'constants'
import "./login.css"
export const Login = () => {
    const [userMail, setUserMail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const hanLogin = async () => {
        const data = await handleLogin(userMail, password);
        if (data === null) {
            alert('Response is not ok');
        } else {
            storage.set(USER_KEY, data);
            console.log(data);
            data.roomId = data.roomIds[0]
            navigate(`/room/${data.roomId}`);
        }
    };

    return (
        <div className="LoginContainer">
            <h1>Log in</h1>
            <input
                className="Name"
                placeholder="Username"
                value={userMail}
                onChange={(e) => setUserMail(e.target.value)}
            />
            <input
                className="Password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="LoginButton" type="submit" onClick={hanLogin}>
                Log In
            </button>
        </div>
    );
};
