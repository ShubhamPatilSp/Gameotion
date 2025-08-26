import axios from 'axios';
import client from './client';

export const api = client;

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
