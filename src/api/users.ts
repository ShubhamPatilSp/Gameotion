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
  gamerTag?: string;
  avatarUrl?: string;
  city?: string;
  friends?: boolean;
}

export async function listNearbyUsers(): Promise<User[]> {
  try {
    // Note: this endpoint is not protected in the demo server
    const response = await api.get<{ items: User[] }>('/api/users/nearby');
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
    const response = await api.get<{ user: Player }>(`/users/${userId}`);
    return response.data.user;
  } catch (error) {
    throw handleApiError(error);
  }
}
