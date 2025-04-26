import './firstPage.css';
import { useState } from 'react';
import { Login } from '../login/login.jsx';
import { useNavigate } from 'react-router-dom';

export const FirstPage = () => {
    const [click, setClick] = useState(false);

    const handleClick = () => {
        setClick(true);
    };
    const navigate = useNavigate();
    return (
                <>
                    <body>
                    <main className="container">
                        <h1>WITAJ W ZswODiH</h1>
                        <p className="subtitle">Łatwy dostęp do informacji i możliwość rozmowy z lekarzem lub
                            opiekunem.</p>

                        <button className="btn-main" onClick={() => navigate('/login')}>Konto pacjenta</button>
                        <p className="hint">(Kliknij tutaj, aby rozpocząć)</p>

                        <div className="info-box">
                            Jeżeli nie masz konta, skontaktuj się z naszym pracownikiem:<br/>
                            Nie musisz się rejestrować samodzielnie.<br/>
                            Zadzwoń pod numer: <span className="link">123&nbsp;456&nbsp;789</span><br/>
                            Lub odwiedź najbliższą <span className="link">placówkę</span>, a my założymy Ci konto.
                        </div>

                        <div className="staff-login" onClick="location.href='login.html'">
                            <span>Logowanie dla pracowników</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                        </div>
                    </main>
                    </body>
                </>
    );
};
