export const fetchUserProfile = async () => {
    let token = localStorage.getItem('token');

    if (!token) {
        const storedTokens = localStorage.getItem('auth_tokens');
        if (storedTokens) {
            try {
                const parsed = JSON.parse(storedTokens);
                token = parsed.accessToken;
            } catch (e) {
                console.error('Error parsing auth_tokens', e);
            }
        }
    }

    // If still no token, we can't fetch
    if (!token) return null;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // If 401, the token is invalid, you might want to return null
            if (response.status === 401) return null;
            throw new Error('Failed to fetch profile');
        }

        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};
