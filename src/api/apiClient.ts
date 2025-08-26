import { Platform } from 'react-native';
import { useAuth } from '../store/auth';

export const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { token } = useAuth.getState();

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'network_error' }));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}
