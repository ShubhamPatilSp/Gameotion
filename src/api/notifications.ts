import api from './client';

export interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment';
  user: { id: string; name: string; avatarUrl: string };
  post?: { id: string; text: string };
  comment?: string;
  createdAt: string;
}

export async function getNotifications(): Promise<Notification[]> {
  const response = await api.get<{ items: Notification[] }>('/api/notifications');
  return response.data.items;
}
