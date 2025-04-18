import { useState } from 'react'
import "./login.css"

function checkData(name, pass){
    //поиск в бд возвращает тру или фолс
    if(name === NULL && pass === NULL){
        return true;
    }
    return false;
}
export const login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const isValid = checkData(userName, password);
        if (isValid) {
            console.log('Успешный вход');
        } else {
            console.log('Ошибка входа');
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
            <button className="LoginButton" type="submit" onClick={handleLogin}>
                Log In
            </button>
        </div>
    );
}