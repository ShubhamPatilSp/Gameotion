import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type Profile = {
  favoriteGames: string[];
  languages: string[];
  location: { country: string; city: string };
};

type ProfileState = {
  profile: Profile;
  hydrated: boolean;
  setProfile: (profile: Partial<Profile>) => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useProfile = create(
  immer<ProfileState>((set, get) => ({
    profile: {
      favoriteGames: [],
      languages: ['en'],
      location: { country: '', city: '' },
    },
    hydrated: false,
    setProfile: async (profile) => {
      const currentProfile = get().profile;
      const newProfile = { ...currentProfile, ...profile };
      await AsyncStorage.setItem('profile', JSON.stringify(newProfile));
      set((state) => {
        state.profile = newProfile;
      });
    },
    hydrate: async () => {
      const profileStr = await AsyncStorage.getItem('profile');
      set((state) => {
        state.profile = profileStr ? JSON.parse(profileStr) : get().profile;
        state.hydrated = true;
      });
    },
  }))
);
