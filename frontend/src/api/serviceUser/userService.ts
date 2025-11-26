import { getAccessToken } from '../serviceAuth/authApi';

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
    avatarUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type UpdateUserPayload = {
    username?: string;
    password?: string;
    avatarUrl?: string;
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

// Update Function
export const updateUserProfile = async (
    userId: string,
    data: UpdateUserPayload,
): Promise<UserProfile> => {
    const accessToken = getAccessToken();

    const payload: any = {};
    if (data.username) payload.username = data.username;
    if (data.password) payload.password = data.password;
    if (data.avatarUrl) payload.avatarUrl = data.avatarUrl;

    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to update profile');
    }

    return response.json();
};
