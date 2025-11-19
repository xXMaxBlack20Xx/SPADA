import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/main/Header';
import SpadaMain from './components/main/mainPage';
import Login from './components/SignIn/Login';
import Register from './components/SignUp/Register';
import MainHome from './components/home/mainHome';
import PredictionsPage from './components/Predictions/PredictionsPage';
import NotFound from './components/Error/NotFound';
import Footer from './components/main/Footer';

function App() {
    const location = useLocation();

    const hideLayout = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/dashboard' || location.pathname === '/predictions';

    return (
        <LanguageProvider>
            {!hideLayout && <Header />}

            <Routes>
                <Route path="/" element={<SpadaMain />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/predictions" element={<PredictionsPage />} />
                <Route path="/mainHome" element={<MainHome />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

            {!hideLayout && <Footer />}
        </LanguageProvider>
    );
}
export default App;
