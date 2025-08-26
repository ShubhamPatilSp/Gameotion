import { fetchWithAuth } from './apiClient';

export const signUp = (email: string, password: string) => {
  return fetchWithAuth('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const login = (email: string, password: string) => {
  return fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};
