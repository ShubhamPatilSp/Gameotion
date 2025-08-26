import api from './client';
import type { User } from '@/store/auth';

export type Conversation = {
  id: string;
  title: string;
  isGroup?: boolean;
  membersCount?: number;
  gameTag?: string;
  extraTag?: string;
  snippet: string;
  time: string;
  unread?: number;
  members: User[];
};

export type Message = {
  id: string;
  text: string;
  user: User;
  createdAt: string;
};

export async function listConversations(): Promise<Conversation[]> {
  const res = await api.get('/conversations');
  return res.data.items || [];
}

export async function listMessages(conversationId: string): Promise<Message[]> {
  const res = await api.get(`/conversations/${conversationId}/messages`);
  return res.data.items || [];
}

export async function sendMessage(conversationId: string, text: string): Promise<Message> {
  const res = await api.post(`/conversations/${conversationId}/messages`, { text });
  return res.data.message;
}
