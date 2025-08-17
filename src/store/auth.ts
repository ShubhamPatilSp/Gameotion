import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type User = { id: string; name: string; avatarUrl: string };

type AuthState = {
  token: string | null;
  user: User | null;
  setSession: (token: string, user: User) => Promise<void>;
  clear: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  token: null,
  user: null,
  setSession: async (token: string, user: User) => {
    await AsyncStorage.multiSet([["auth_token", token], ["auth_user", JSON.stringify(user)]]);
    set({ token, user });
  },
  clear: async () => {
    await AsyncStorage.multiRemove(["auth_token", "auth_user"]);
    set({ token: null, user: null });
  },
  hydrate: async () => {
    const [[, token], [, userStr]] = await AsyncStorage.multiGet(["auth_token", "auth_user"]);
    set({ token: token ?? null, user: userStr ? JSON.parse(userStr) : null });
  },
}));


