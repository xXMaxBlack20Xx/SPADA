import { getAccessToken } from './authApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type AuthProfilePayload = {
    userId: string;
    email: string;
};

export type UserProfile = {
    id: string;
    username?: string | null;
    email: string;
    role?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
};

export const fetchUserProfile = async (): Promise<UserProfile | null> => {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return null;
    }

    try {
        const profileRes = await fetch(`${API_URL}/auth/profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!profileRes.ok) {
            if (profileRes.status === 401) return null;
            throw new Error('Failed to fetch auth profile');
        }

        const profile: AuthProfilePayload = await profileRes.json();

        const userRes = await fetch(`${API_URL}/users/${profile.userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!userRes.ok) {
            if (userRes.status === 401) return null;
            throw new Error('Failed to fetch user details');
        }

        const user = (await userRes.json()) as UserProfile;

        return {
            id: user.id,
            username: user.username ?? null,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};
