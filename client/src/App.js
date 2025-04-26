import { BrowserRouter } from 'react-router-dom'
import AppRoutes from 'routes/app.routes'
import {FirstPage} from "./components/firstPage/firstPage";
import './App.scss'
import { Routes, Route } from 'react-router-dom';
import { Login } from './components/login/login';

function App() {
  return (
    <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App

