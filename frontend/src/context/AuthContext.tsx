import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Define the shape of the context
interface AuthContextType {
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

// 2. Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // On initial load, try to get the token from storage
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        }
    }, []);

    // 4. Create the LOGIN function
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Use 'email' to match our NestJS LoginDto
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                let msg = `Error: ${res.status}`;
                try {
                    const data = await res.json();
                    if (data.message) {
                        msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
                    }
                } catch {
                    msg = `Error: ${res.status} ${res.statusText}`;
                }
                throw new Error(msg);
            }

            const tokens = await res.json();

            setAccessToken(tokens.accessToken);
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            navigate('/mainHome');
        } catch (err: any) {
            console.error('Error in login:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setAccessToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    const value = {
        accessToken,
        isLoading,
        error,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
