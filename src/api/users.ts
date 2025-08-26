import { api, handleApiError } from './utils';

// This is for the nearby screen
export interface UserTag {
  label: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  distance: string;
  location: {
    city: string;
    country: string;
  };
  roles: string;
  tags: UserTag[];
}

// A more generic user profile for search and profile screens
export interface Player {
  id: string;
  name: string;
  displayName?: string;
  gamerTag?: string;
  isVerified?: boolean;
  avatarUrl?: string;
  isOnline?: boolean;
  gameTags?: string[];
  bio?: string;
  followers?: number;
  following?: number;
  level?: number;
  location?: string;
  joined?: string;
  stats?: {
    winRate?: string;
    kdRatio?: string;
    hoursPlayed?: string;
    matches?: string;
  };
  friends?: boolean;
  followingList?: string[];
}

export async function listNearbyUsers(): Promise<User[]> {
  try {
    // Matches server route in server/app.ts -> app.get('/users/nearby', protect, ...)
    const response = await api.get<{ items: User[] }>('/users/nearby');
    return response.data.items;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function searchUsers(query: string): Promise<Player[]> {
  try {
    if (!query.trim()) {
      return [];
    }
    const response = await api.get<{ items: Player[] }>(`/api/users/search`, { params: { query } });
    return response.data.items;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getUserProfile(userId: string): Promise<Player> {
  try {
    // Matches server route in server/app.ts -> app.get('/users/:id', ...)
    const response = await api.get<{ user: Player }>(`/users/${userId}`);
    return response.data.user;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function followUser(userId: string): Promise<{ success: boolean }> {
  try {
    const response = await api.post(`/api/users/${userId}/follow`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function unfollowUser(userId: string): Promise<{ success: boolean }> {
  try {
    const response = await api.post(`/api/users/${userId}/unfollow`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
