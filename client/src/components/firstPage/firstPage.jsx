import './firstPage.css';
import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Login } from '../login/login';

export const FirstPage = () => {
    const [isLoginVisible, setIsLoginVisible] = useState(false);

    // Открытие окна логина
    const openLogin = () => setIsLoginVisible(true);

    // Закрытие окна логина
    const closeLogin = () => setIsLoginVisible(false);

    // Анимация SVG линий
    useEffect(() => {
        const paths = document.querySelectorAll('.svg-line path');

        paths.forEach((path, i) => {
            const length = path.getTotalLength(); // Получаем длину пути
            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length,
            });

            // Анимация линии
            gsap.to(path, {
                strokeDashoffset: 0,
                duration: 2.5 + i, // Увеличиваем длительность для каждой линии
                ease: 'power2.inOut',
                repeat: -1, // Бесконечная анимация
                yoyo: true, // Анимация "туда-сюда"
            });
        });
    }, []);

    useEffect(() => {
        // Анимация появления модального окна
        if (isLoginVisible) {
            gsap.fromTo(
                '.modal-overlay',
                { opacity: 0, visibility: 'hidden' },
                { opacity: 1, visibility: 'visible', duration: 0.3, ease: 'power2.out' }
            );

            gsap.fromTo(
                '.modal-content',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
            );
        } else {
            gsap.to('.modal-overlay', {
                opacity: 0,
                visibility: 'hidden',
                duration: 0.3,
                ease: 'power2.out',
            });

            gsap.to('.modal-content', {
                opacity: 0,
                y: 50,
                duration: 0.3,
                ease: 'power2.out',
            });
        }
    }, [isLoginVisible]);

    return (
        <div className="firstPage-background">
            <div className="background-svg-wrapper">
                {/* Контейнер для SVG-линий */}
                <svg
                    className="svg-line"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1920 1080"
                    preserveAspectRatio="none"
                    width="100%"
                    height="100%"
                >
                    <path
                        d="M0,200 Q960,500 1920,200 T3840,200"
                        stroke="rgba(255, 255, 255, 0.5)"
                        strokeWidth="2"
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                    />
                    <path
                        d="M0,400 C480,150 1440,650 1920,400 S2880,150 3360,400"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="2.5"
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                    />
                    <path
                        d="M0,600 C600,300 1320,900 1920,600 Q2520,300 3120,600"
                        stroke="rgba(255, 255, 255, 0.4)"
                        strokeWidth="1.8"
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            </div>

            {/* Контент страницы */}
            <div className="firstPage-container">
                <main className="container">
                    <h1>WITAMY W E-HOSP</h1>
                    <p className="subtitle">
                        Łatwy dostęp do informacji i możliwość rozmowy z lekarzem lub opiekunem.
                    </p>
                    <button className="btn-main" onClick={openLogin}>
                        Moje konto
                    </button>
                    <p className="hint">(Kliknij tutaj, aby rozpocząć)</p>
                    <div className="info-box">
                        Jeżeli nie masz konta, skontaktuj się z naszym pracownikiem:<br/>
                        Nie musisz się rejestrować samodzielnie.<br/>
                        Zadzwoń pod numer: <span className="link">123&nbsp;456&nbsp;789</span><br />
                        Lub odwiedź najbliższą <span className="link">placówkę</span>, a my założymy Ci konto.
                    </div>
                </main>
            </div>

            {/* Модальное окно логина */}
            <div
                className={`modal-overlay ${isLoginVisible ? 'active' : ''}`}
                onClick={closeLogin}
            >
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={closeLogin}>
                        ×
                    </button>
                    <Login />
                </div>
            </div>
        </div>
    );
};