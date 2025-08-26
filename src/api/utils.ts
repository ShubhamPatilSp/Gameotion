import axios from 'axios';
import client from './client';

export const api = client;

export function handleApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const res = error.response;
    if (res) {
      const serverMsg =
        (typeof res.data === 'string' ? res.data : undefined) ||
        (res.data?.error as string | undefined) ||
        (res.data?.message as string | undefined) ||
        res.statusText ||
        error.message;
      const msgWithCode = res.status ? `[${res.status}] ${serverMsg}` : serverMsg;
      return new Error(msgWithCode || 'API error');
    }
    // No response => network or CORS-type error
    return new Error(error.message || 'Network error');
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error('An unexpected error occurred');
}
