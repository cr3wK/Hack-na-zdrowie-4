import { useState } from 'react';
import './login.css';
import { handleLogin } from './auth';

export const Login = () => {
    const [userMail, setUserMail] = useState('');
    const [password, setPassword] = useState('');

    const hanLogin = async () => {
        const data = await handleLogin(userMail, password);
        if (data === null) {
            alert('Response is not ok');
        } else {
            alert('Response ok');
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
