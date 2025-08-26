import client from './client';

export interface ProfileData {
  displayName: string;
  gamerTag: string;
  avatarUrl?: string;
}

export const updateProfile = (data: ProfileData) => {
  return client.put('/api/user/profile', data);
};
