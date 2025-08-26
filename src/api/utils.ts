import axios from 'axios';
import API_URL from './client';
import { getToken } from '@/auth/auth';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function handleApiError(error: unknown): Error {
  if (axios.isAxiosError(error) && error.response) {
    const message = error.response.data?.error || 'An unknown API error occurred';
    return new Error(message);
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error('An unexpected error occurred');
}
