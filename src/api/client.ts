import axios from 'axios';
import { Platform } from 'react-native';
import { useAuth } from '@/store/auth';

const baseURL = Platform.select({
  ios: 'http://localhost:4000',
  android: 'http://10.0.2.2:4000',
  default: 'http://localhost:4000',
});

export const api = axios.create({
  baseURL,
  timeout: 8000,
});

// Attach token if available
api.interceptors.request.use((config) => {
  try {
    const { token } = useAuth.getState();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export default api;


