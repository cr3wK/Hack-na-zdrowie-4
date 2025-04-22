import { useState } from 'react'
import "./login.css"
import {handleLogin} from '..../auth.js'
//скорее всего auth надо будет поближе пенести или вообще сюда засунуть
export const login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const hanLogin = () => {
        const data = handleLogin(userName, password);
        if (data === null) {
            console.log('Response is not ok');
        } else {
            console.log('Response ok');
        }
    };

    return (
        <div className='LoginContainer'>
            <h1>Log in</h1>
            <input
                className="Name"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
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
}