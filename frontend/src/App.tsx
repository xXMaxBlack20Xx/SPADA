import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { getAccessToken } from './api/serviceAuth/authApi';
import type { ReactNode } from 'react';
import Header from './components/main/Header';
import SpadaMain from './components/main/mainPage';
import Login from './components/signIn/Login';
import Register from './components/signUp/Register';
import NotFound from './components/error/NotFound';
import Footer from './components/main/Footer';
import Dashboard from './components/layouts/Dashboard';
import PredictionsNBA from './components/dashboard/predictions/PredictionsNBA';
import PredictionsNFL from './components/dashboard/predictions/PredictionsNFL';
import Calendar from './components/dashboard/calendar/Calendar';

import './App.css';
import Binnacle from './components/dashboard/binnacle/Binnacle';
import Settings from './components/dashboard/setttings/Settings';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const token = getAccessToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const PublicLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

function App() {
    return (
        <LanguageProvider>
            <Routes>
                {/* GROUP A: Routes WITH Header & Footer */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<SpadaMain />} />
                    {/* Add other public pages here like /about, /contact, etc. */}
                </Route>

                {/* GROUP B: Routes WITHOUT Header & Footer (Stand-alone pages) */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="*" element={<NotFound />} />

                {/* DASHBOARD ROUTES - NOW PROTECTED */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                >
                    {/* This ensures /dashboard redirects to the house hall */}
                    <Route index element={<Navigate to="/dashboard" replace />} />

                    {/* The new component */}
                    <Route path="predictNBA" element={<PredictionsNBA />} />
                    <Route path="predictNFL" element={<PredictionsNFL />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="binnacle" element={<Binnacle />} />
                    <Route
                        path="community"
                        element={<h1 className="text-white">Community Page</h1>}
                    />
                    <Route path="settings" element={<Settings />} />

                    {/* Placeholders for the other links so they don't 404 */}
                    <Route path="stats" element={<h1 className="text-white">Stats Page</h1>} />
                </Route>
            </Routes>
        </LanguageProvider>
    );
}

export default App;
