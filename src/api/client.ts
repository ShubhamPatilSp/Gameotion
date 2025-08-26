import axios from 'axios';
import { Platform } from 'react-native';
import { useAuth } from '@/store/auth';

const baseURL = Platform.select({
  ios: 'http://localhost:4000',
  android: 'http://10.0.2.2:4000',
});

const client = axios.create({
  baseURL,
});

client.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;


