import { fetchWithAuth } from './apiClient';

export type Clan = {
  id: string;
  name: string;
  tag: string;
  level: number;
  region: string;
  gameTags: string[];
  description: string;
  membersCount: number;
  membersMax: number;
  founded: string;
  requirements: string[];
  recruiting: boolean;
};

export type Invite = {
  id: string;
  clanId: string;
  clanName: string;
  userId: string;
  inviterId: string;
  inviterName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
};

export async function listClans(): Promise<Clan[]> {
  const data = await fetchWithAuth('/api/clans');
  return data.items;
}

export async function createClan(payload: { name: string; tag: string; description?: string }): Promise<{ clan: Clan }> {
  return fetchWithAuth('/api/clans', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listMyClans(): Promise<Clan[]> {
  const data = await fetchWithAuth('/api/clans/my');
  return data.items;
}

export async function joinClan(clanId: string): Promise<Clan> {
  const data = await fetchWithAuth(`/api/clans/${clanId}/join`, { method: 'POST' });
  return data.clan;
}

export async function inviteToClan(clanId: string, userId: string): Promise<{ invite: Invite }> {
  return fetchWithAuth(`/api/clans/${clanId}/invites`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function listInvites(): Promise<Invite[]> {
  const data = await fetchWithAuth('/api/invites');
  return data.items;
}

export async function acceptInvite(inviteId: string): Promise<{ clan: Clan }> {
  return fetchWithAuth(`/api/invites/${inviteId}/accept`, { method: 'POST' });
}

export async function rejectInvite(inviteId: string): Promise<{ ok: boolean }> {
  return fetchWithAuth(`/api/invites/${inviteId}/reject`, { method: 'POST' });
}

export async function leaveClan(clanId: string): Promise<{ clan: Clan }> {
  return fetchWithAuth(`/api/clans/${clanId}/leave`, { method: 'POST' });
}

