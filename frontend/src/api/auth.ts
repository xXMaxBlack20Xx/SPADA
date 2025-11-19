const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TOKEN_STORAGE_KEY = 'auth_tokens';

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

interface SignupPayload {
    email: string;
    password: string;
    name?: string;
}

// Store tokens in localStorage
export function setTokens(tokens: AuthTokens): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

// Retrieve tokens from localStorage
export function getTokens(): AuthTokens | null {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
}

// Get access token
export function getAccessToken(): string | null {
    const tokens = getTokens();
    return tokens?.accessToken || null;
}

// Get refresh token
export function getRefreshToken(): string | null {
    const tokens = getTokens();
    return tokens?.refreshToken || null;
}

// Clear tokens from localStorage
export function clearTokens(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function signup(payload: SignupPayload) {
    const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Signup failed');
    }

    const tokens = await res.json();
    setTokens(tokens);
    return tokens;
}

export async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
    }

    const tokens = await res.json();
    setTokens(tokens);
    return tokens;
}

export async function logout() {
    const accessToken = getAccessToken();

    try {
        if (accessToken) {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                credentials: 'include',
            });
        }
    } catch (error) {
        console.error('Logout request failed:', error);
    } finally {
        // Always clear tokens locally even if the request fails
        clearTokens();
    }
}

export async function refreshAccessToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
    });

    if (!res.ok) {
        clearTokens(); // Clear tokens if refresh fails
        throw new Error('Token refresh failed');
    }

    const tokens = await res.json();
    setTokens(tokens);
    return tokens;
}

export async function isAuthenticated(): Promise<boolean> {
    const accessToken = getAccessToken();
    if (!accessToken) return false;

    try {
        const res = await fetch(`${API_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            credentials: 'include',
        });
        return res.ok;
    } catch {
        return false;
    }
}
