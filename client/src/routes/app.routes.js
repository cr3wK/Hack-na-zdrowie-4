import { Home } from 'pages';
import { Route, Routes } from 'react-router-dom';
import { CalendarComponent } from 'components/calendar/CalendarComponent';

const AppRoutes = () => (
    <div>
        {/* Календарь размещается верхним слоем */}
        <CalendarComponent />

        {/* Основные маршруты */}
        <Routes>
            <Route path="/" element={<Home />} />
            {/* Убираем MainPage как страницу */}
            <Route path="*" element={<Home />} />
        </Routes>
    </div>
);

export default AppRoutes;