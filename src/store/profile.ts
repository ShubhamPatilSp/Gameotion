import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type OAuthProvider = { provider: string; providerId: string };

export type UserProfile = {
  _id?: string;
  email?: string;
  passwordHash?: string;
  oauthProviders?: OAuthProvider[];
  displayName?: string;
  gamerTag?: string;
  avatarUrl?: string;
  location?: { country?: string; city?: string; coords?: { lat: number; lng: number } };
  languages?: string[];
  favoriteGames?: string[];
  skillLevels?: Record<string, string>;
  createdAt?: string;
  verified?: { email?: boolean; phone?: boolean };
};

type ProfileState = {
  onboarded: boolean;
  profile: UserProfile;
  setProfile: (patch: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;
};

export const useProfile = create<ProfileState>((set, get) => ({
  onboarded: false,
  profile: {
    languages: [],
    favoriteGames: [],
    skillLevels: {},
    verified: { email: false, phone: false },
  },
  setProfile: async (patch: Partial<UserProfile>) => {
    const next = { ...get().profile, ...patch };
    set({ profile: next });
    await AsyncStorage.setItem('gv_profile', JSON.stringify(next));
  },
  completeOnboarding: async () => {
    set({ onboarded: true });
    await AsyncStorage.setItem('gv_onboarded', '1');
  },
  hydrate: async () => {
    const [onb, prof] = await Promise.all([
      AsyncStorage.getItem('gv_onboarded'),
      AsyncStorage.getItem('gv_profile'),
    ]);
    set({
      onboarded: onb === '1',
      profile: prof ? JSON.parse(prof) : get().profile,
    });
  },
  reset: async () => {
    await AsyncStorage.multiRemove(['gv_onboarded', 'gv_profile']);
    set({ onboarded: false, profile: { languages: [], favoriteGames: [], skillLevels: {}, verified: {} } });
  },
}));


