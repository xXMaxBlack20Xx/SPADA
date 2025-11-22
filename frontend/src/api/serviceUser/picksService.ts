import { getAccessToken } from '../auth/auth';
const API_URL = '/api/picks';

export const togglePickPrediction = async (gameId: string, data: any) => {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}/toggle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameId, data }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Toggle request failed: ${text}`);
    }

    return res.json();
};

export const fetchUserPicks = async () => {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}/my-picks`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Fetch user picks failed: ${text}`);
    }

    const data = await res.json();

    return data.map((pick: any) => pick.pickId);
};
