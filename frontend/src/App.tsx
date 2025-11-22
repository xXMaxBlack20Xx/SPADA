import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { getAccessToken } from './api/auth/auth';
import type { ReactNode } from 'react';
import Header from './components/main/Header';
import SpadaMain from './components/main/mainPage';
import Login from './components/SignIn/Login';
import Register from './components/SignUp/Register';
import NotFound from './components/Error/NotFound';
import Footer from './components/main/Footer';
import Dashboard from './components/layouts/Dashboard';
import Predictions from './components/dashboard/Predictions/PredictionsNBA';
import './App.css';

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
                    {/* This ensures /dashboard redirects to /dashboard/predict by default */}
                    <Route index element={<Navigate to="/dashboard/predict" replace />} />

                    {/* The new component */}
                    <Route path="predict" element={<Predictions />} />

                    {/* Placeholders for the other links so they don't 404 */}
                    <Route
                        path="calendar"
                        element={<h1 className="text-white">Calendar Page</h1>}
                    />
                    <Route
                        path="community"
                        element={<h1 className="text-white">Community Page</h1>}
                    />
                    <Route
                        path="binnacle"
                        element={<h1 className="text-white">Binnacle Page</h1>}
                    />
                    <Route path="stats" element={<h1 className="text-white">Stats Page</h1>} />
                    <Route
                        path="settings"
                        element={<h1 className="text-white">Settings Page</h1>}
                    />
                </Route>
            </Routes>
        </LanguageProvider>
    );
}

export default App;
