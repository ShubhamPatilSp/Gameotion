import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

const client = axios.create({
  baseURL,
});

client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Log API errors for easier debugging on device
client.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const method = error?.config?.method?.toUpperCase?.() || 'UNKNOWN';
      const url = error?.config?.url || 'UNKNOWN_URL';
      const status = error?.response?.status;
      const data = error?.response?.data;
      // Keep logs lightweight to avoid crashing older devices
      console.warn('[API]', method, url, status ?? '', typeof data === 'object' ? JSON.stringify(data) : String(data || ''));
    } catch {}
    return Promise.reject(error);
  }
);

export default client;


