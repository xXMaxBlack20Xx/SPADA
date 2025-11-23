import { getAccessToken } from '../auth/authApi';

const API_URL = '/api/calendar';

export interface CalendarGame {
    gameId: string;
    date: string;
    shortName: string;
    status: string;
    homeTeam: string;
    awayTeam: string;
    homeLogo: string;
    awayLogo: string;
}

export const fetchSchedule = async (dateStr: string): Promise<CalendarGame[]> => {
    try {
        const res = await fetch(`${API_URL}/schedule?date=${dateStr}`);
        if (!res.ok) throw new Error('Failed to fetch schedule');
        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const fetchSavedGames = async (): Promise<string[]> => {
    const token = getAccessToken();
    if (!token) return [];

    try {
        const res = await fetch(`${API_URL}/my-games`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((g: any) => g.gameId);
    } catch (error) {
        return [];
    }
};

export const toggleGameSave = async (gameId: string, date: string, matchup: string) => {
    const token = getAccessToken();
    if (!token) return;

    await fetch(`${API_URL}/toggle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameId, date, matchup }),
    });
};
