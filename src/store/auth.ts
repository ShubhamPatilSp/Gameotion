import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type User = { id: string; name: string; email: string; avatarUrl: string; gamerTag?: string; onboarded?: boolean; location?: { country?: string; city?: string; coords?: { lat: number; lng: number } }; followingList?: string[]; };

type AuthState = {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  setSession: (token: string, user: User) => Promise<void>;
  clear: () => Promise<void>;
  hydrate: () => Promise<void>;
  setUser: (user: User) => void;
};

export const useAuth = create(
  immer<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,
  setSession: async (token: string, user: User) => {
    await AsyncStorage.multiSet([["auth_token", token], ["auth_user", JSON.stringify(user)]]);
    set((state) => {
      state.token = token;
      state.user = user;
    });
  },
  clear: async () => {
    await AsyncStorage.multiRemove(["auth_token", "auth_user"]);
    set((state) => {
      state.token = null;
      state.user = null;
    });
  },
  hydrate: async () => {
    const [[, token], [, userStr]] = await AsyncStorage.multiGet(["auth_token", "auth_user"]);
    set((state) => {
      state.token = token ?? null;
      state.user = userStr ? JSON.parse(userStr) : null;
      state.hydrated = true;
    });
  },
  setUser: (user: User) => set((state) => { state.user = user; }),
})),
);


