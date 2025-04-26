import './firstPage.css';
import { useState } from 'react';
import { Login } from '../login/login.jsx';

export const FirstPage = () => {
    const [click, setClick] = useState(false);

    const handleClick = () => {
        setClick(true);
    };

    return (
        <>
            {click ? (
                <Login />
            ) : (
                <>
                    <h1>
                        Это первая страница, которая существует для перехода на
                        регистрацию.
                    </h1>
                    <button onClick={handleClick}>Перейти к логину</button>
                </>
            )}
        </>
    );
};
