import api from '@/api/client';

export type Media = { url: string; type: 'image' | 'video' };
export type FeedEvent = {
  id: string;
  kind: 'event';
  title: string;
  gameTag: string;
  startsAt: string;
  city?: string;
  cta?: string;
  createdAt: string;
};

export type FeedPost = {
  id: string;
  kind?: 'post';
  authorId: string;
  user: { id: string; name: string; avatarUrl: string };
  contentText: string;
  media: Media[];
  gameTags: string[];
  location?: { city?: string };
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  viewsCount?: number;
  visibility?: string;
};

export type FeedItem = FeedPost | FeedEvent;

export type FeedFilters = { scope: 'all' | 'friends' | 'nearby' | 'tournaments' | 'clips'; game?: string };

export async function fetchFeedPage(params: {
  page: number;
  limit: number;
  filters: FeedFilters;
  preferredCity?: string;
}): Promise<{ items: FeedItem[]; nextPage: number | null }>
{
  const { page, limit, filters, preferredCity } = params;
  const res = await api.get('/feed', {
    params: {
      page,
      limit,
      game: filters.game,
      city: filters.scope === 'nearby' ? preferredCity : undefined,
      friends: filters.scope === 'friends',
    },
  });
  return res.data as { items: FeedItem[]; nextPage: number | null };
}

export async function fetchUserPosts(params: { userId: string; page: number; limit: number }): Promise<{ items: FeedPost[]; nextPage: number | null }>
{
  const { userId, page, limit } = params;
  const res = await api.get(`/users/${userId}/posts`, { params: { page, limit } });
  return res.data as { items: FeedPost[]; nextPage: number | null };
}


export async function bookmarkPost(postId: string): Promise<boolean> {
  await api.post(`/posts/${postId}/bookmark`);
  return true;
}

export async function likePost(postId: string): Promise<number> {
  const res = await api.post(`/posts/${postId}/like`);
  return res.data.likesCount as number;
}

export async function unlikePost(postId: string): Promise<number> {
  const res = await api.delete(`/posts/${postId}/like`);
  return res.data.likesCount as number;
}

export async function sharePost(postId: string): Promise<number> {
  const res = await api.post(`/posts/${postId}/share`);
  return res.data.viewsCount as number;
}

export async function commentPost(postId: string, text: string): Promise<number> {
  const res = await api.post(`/posts/${postId}/comment`, { text });
  return res.data.commentsCount as number;
}

export async function listComments(postId: string): Promise<{ id: string; user: { id: string; name: string; avatarUrl: string }; text: string; createdAt: string }[]> {
  const res = await api.get(`/posts/${postId}/comments`);
  return res.data.items ?? [];
}

export async function createPost(post: { contentText: string; gameTags?: string[]; media?: Media[]; city?: string }): Promise<FeedPost> {
  const res = await api.post('/posts', post);
  return res.data.post;
}

export async function addComment(postId: string, text: string): Promise<{ id: string; user: { id: string; name: string; avatarUrl: string }; text: string; createdAt: string }>{
  const res = await api.post(`/posts/${postId}/comments`, { text });
  return res.data.comment;
}


