const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TOKEN_STORAGE_KEY = 'auth_tokens';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface SignupPayload {
    email: string;
    password: string;
    name?: string;
}

// ========== TOKEN HELPERS ==========

// Store tokens in localStorage
export function setTokens(tokens: AuthTokens): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

// Retrieve tokens from localStorage
export function getTokens(): AuthTokens | null {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthTokens) : null;
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

// ========== AUTH API ==========

export async function signup(payload: SignupPayload) {
    const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let message = 'Signup failed';
        try {
            const err = await res.json();
            message = err.message || message;
        } catch {
            // ignore parse error
        }
        throw new Error(message);
    }

    const tokens: AuthTokens = await res.json();
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
    });

    if (!res.ok) {
        let message = 'Login failed';
        try {
            const err = await res.json();
            message = err.message || message;
        } catch {
            // ignore parse error
        }
        throw new Error(message);
    }

    const tokens: AuthTokens = await res.json();
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
            });
        }
    } catch (error) {
        console.error('Logout request failed:', error);
    } finally {
        // Always clear tokens locally even if the request fails
        clearTokens();
    }
}

/**
 * Calls /auth/refresh using the refresh token.
 *
 * IMPORTANT:
 * - Backend is expecting:
 *    - Authorization: Bearer <refreshToken>  (guard: JwtAuthGuard using refresh JWT)
 *    - body: { refreshToken }
 */
export async function refreshAccessToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // we send the refresh token in the Authorization header
            Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
        clearTokens(); // Clear tokens if refresh fails
        throw new Error('Token refresh failed');
    }

    const tokens: AuthTokens = await res.json();
    setTokens(tokens);
    return tokens;
}

/**
 * Simple check using /auth/profile.
 * Returns true if the current access token is valid.
 */
export async function isAuthenticated(): Promise<boolean> {
    const accessToken = getAccessToken();
    if (!accessToken) return false;

    try {
        const res = await fetch(`${API_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.ok;
    } catch {
        return false;
    }
}
