import { getAccessToken } from '../serviceAuth/authApi';

const API_URL = 'http://localhost:3000/bets';

export type BetStatus = 'PENDING' | 'WON' | 'LOST' | 'PUSH';

export type SportLeague = 'NBA' | 'NFL';

export interface CreateBetPayload {
    userId: string;
    stake: number;
    odds: number;
    matchId: string;
    league: SportLeague;
    matchTitle: string;
    evPercent?: number;
}

export interface SettleBetPayload {
    userId: string;
    status: BetStatus;
}

export const fetchMyBets = async (userId: string) => {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}?userId=${userId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Fetch bets failed: ${text}`);
    }

    return res.json();
};

export const fetchBetStats = async (userId: string) => {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}/stats?userId=${userId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Fetch stats failed: ${text}`);
    }

    return res.json();
};

export const createBet = async (data: CreateBetPayload) => {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Create bet failed: ${text}`);
    }

    return res.json();
};

export const settleBet = async (betId: string, data: SettleBetPayload) => {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}/${betId}/settle`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Settle bet failed: ${text}`);
    }

    return res.json();
};
