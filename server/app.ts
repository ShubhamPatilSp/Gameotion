import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

// --- Type Definitions ---
interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  avatarUrl: string;
  onboarded: boolean;
  friends?: boolean;
  gamerTag?: string;
  displayName?: string;
  location?: { country?: string; city?: string };
  city?: string;
}

interface Post {
  id: string;
  authorId: string;
  user: User;
  contentText: string;
  media: any[];
  gameTags: string[];
  location?: { city?: string };
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  visibility: string;
  kind?: 'post'; // Added for type narrowing
  gameTag?: string; // Added for type narrowing
  engagementHint?: number; // Added for type narrowing
  city?: string; // Added for type narrowing
}

interface Clan {
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
  members: string[];
}

interface Comment {
  id: string;
  user: Partial<User>;
  text: string;
  createdAt: string;
}

interface Conversation {
    id: string;
    title: string;
    gameTag: string;
    extraTag?: string;
    snippet: string;
    time: string;
    unread?: number;
    members: Partial<User>[];
    isGroup?: boolean;
    membersCount?: number;
}

interface Message {
    id: string;
    text: string;
    user: User;
    createdAt: string;
}

interface Invite {
    id: string;
    clanId: string;
    clanName: string;
    userId: string;
    inviterId: string;
    inviterName: string;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    createdAt: string;
}


// Custom Express Request
interface AuthRequest extends Request {
  user?: User;
}

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

let demoUsers: User[] = [];
const users: User[] = []; // In-memory user store

const demoPosts: Post[] = [];

// In-memory stores
const commentsStore = new Map<string, Comment[]>();
const conversationsStore = new Map<string, Conversation>();
const messagesStore = new Map<string, Message[]>();
const clansStore = new Map<string, Clan>();
const invitesStore = new Map<string, Invite>();
const tokens = new Map<string, User>(); // token -> user

const STATIC_DEV_TOKEN = 'dev-token-for-user-1';

function seedInitialData() {
  // Seed a default user for stable development
  if (users.length === 0) {
    const defaultUser: User = {
      id: 'u1',
      email: 'dev@gameotion.com',
      password: 'password',
      name: 'Dev User',
      avatarUrl: 'https://i.pravatar.cc/100?u=dev@gameotion.com',
      onboarded: true,
    };
    const demoUser2: User = {
      id: 'u2',
      email: 'demo@gameotion.com',
      password: 'password',
      name: 'Demo User 2',
      avatarUrl: 'https://i.pravatar.cc/100?u=demo@gameotion.com',
      onboarded: true,
    };
    users.push(defaultUser, demoUser2);
    demoUsers.push(defaultUser, demoUser2);
    tokens.set(STATIC_DEV_TOKEN, defaultUser);
    console.log('✅ Default users and token seeded.');
  }

  if (clansStore.size === 0) {
    const demoClans: Clan[] = [
      { id: 'cl1', name: 'Neon Warriors', tag: 'NEON', level: 15, region: 'Asia', gameTags: ['Valorant', 'Diamond'], description: 'Elite Valorant clan looking for Diamond+ players. Active daily, tournaments every weekend.', membersCount: 127, membersMax: 150, founded: '2023', requirements: ['Diamond+ rank', '18+ age', 'active daily'], recruiting: true, members: [] },
      { id: 'cl2', name: 'Shadow Legends', tag: 'SHDW', level: 12, region: 'India', gameTags: ['BGMI', 'Platinum'], description: 'Multi-game competitive clan. BGMI, COD Mobile, and more. Family-friendly community.', membersCount: 89, membersMax: 100, founded: '2024', requirements: ['Platinum+ rank', 'good attitude'], recruiting: true, members: [] },
      { id: 'cl3', name: 'Cyber Phoenixes', tag: 'CYBER', level: 25, region: 'Global', gameTags: ['Multiple', 'Immortal'], description: 'High-level multi-game clan with weekly events and scrims.', membersCount: 210, membersMax: 250, founded: '2021', requirements: ['Immortal+ rank', 'scrim-ready'], recruiting: false, members: [] },
    ];
    demoClans.forEach(c => clansStore.set(c.id, c));
    console.log('✅ Demo clans seeded.');
  }
}

app.get('/health', (req: Request, res: Response) => res.json({ ok: true }));

// Ranked feed: /feed?game=valorant&city=Delhi&page=1&limit=10
app.get('/feed', (req: Request, res: Response) => {
  const { game, city, page = 1, limit = 10, friends } = req.query;
  const w1 = 0.5; // recency
  const w2 = 0.3; // user match (game/city/friends)
  const w3 = 0.2; // engagement
  const nowTs = Date.now();

  let items: Post[] = demoPosts.slice();
  if (game) {
    items = items.filter((p) => (p.kind === 'post' ? (p.gameTags || []).includes(String(game)) : p.gameTag === String(game)));
  }

  const scored = items.map((p) => {
    const ageHours = (nowTs - new Date(p.createdAt).getTime()) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 1 - ageHours / 24); // 0..1
    const isCity = city && (p.location?.city || p.city) && String(city).toLowerCase() === String(p.location?.city || p.city).toLowerCase();
    const isFriend = String(friends) === 'true' && p.kind === 'post' && demoUsers.find((u) => u.id === p.authorId)?.friends;
    const hasGame = p.kind === 'post' ? (p.gameTags || []).includes(String(game)) : p.gameTag === String(game);
    const userMatch = (game && hasGame) || isCity || isFriend ? 1 : 0;
    const engagement = p.kind === 'post' ? (p.likesCount + p.commentsCount) : p.engagementHint || 0;
    const engagementNorm = Math.min(1, engagement / 500);
    const score = w1 * recencyScore + w2 * (userMatch ? 1 : 0) + w3 * engagementNorm;
    return { p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);
  const pageItems = scored.slice(start, end).map((s) => s.p);
  res.json({ items: pageItems, nextPage: end < scored.length ? Number(page) + 1 : null });
});

app.get('/posts', (req: Request, res: Response) => {
  return res.json({ posts: demoPosts });
});

// Lightweight interactions (demo-only)
app.post('/posts/:id/like', (req: Request, res: Response) => {
  const { action } = req.body || {};
  const p = demoPosts.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'not_found' });
  p.likesCount = Math.max(0, (p.likesCount || 0) + (action === 'unlike' ? -1 : 1));
  return res.json({ likesCount: p.likesCount });
});

app.post('/posts/:id/bookmark', (req: Request, res: Response) => {
  // demo: no persistence, just echo
  const exists = !!demoPosts.find((x) => x.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'not_found' });
  return res.json({ ok: true });
});

app.post('/posts/:id/share', (req: Request, res: Response) => {
  const p = demoPosts.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'not_found' });
  p.viewsCount = (p.viewsCount || 0) + 1;
  return res.json({ viewsCount: p.viewsCount });
});

// User endpoints for profile + posts
app.get('/users/:id', (req: Request, res: Response) => {
  const user = demoUsers.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'not_found' });
  return res.json({ user });
});

app.get('/users/:id/posts', (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const items = demoPosts.filter((p) => p.authorId === req.params.id);
  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);
  const pageItems = items.slice(start, end);
  const nextPage = end < items.length ? Number(page) + 1 : null;
  return res.json({ items: pageItems, nextPage });
});

// --- Simple Email/Password Auth (demo-only, in-memory) ---

// Middleware to protect routes
const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = bearer.split('Bearer ')[1].trim();
  const user = tokens.get(token);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  // Attach user to the request object
  const fullUser = users.find(u => u.id === user.id);
  if (!fullUser) {
    return res.status(401).json({ error: 'Unauthorized: User not found' });
  }

  (req as AuthRequest).user = fullUser;
  next();
};

function generateToken(userId: string): string {
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

app.post('/auth/signup', (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // For development, any signup attempt logs you in as the default user.
  const defaultUser = users.find(u => u.id === 'u1');
  if (!defaultUser) {
    // This should not happen if seeding is correct
    return res.status(500).json({ error: 'Default user not found' });
  }

  console.log(`Dev signup attempt for: ${email}, returning static token.`);
  res.status(201).json({ token: STATIC_DEV_TOKEN, user: defaultUser });
});

app.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    // For development, you can log in with any email/password
    // and you will be logged in as the default user.
    console.log(`Dev login attempt for: ${email}, returning static token.`);
    res.json({ token: STATIC_DEV_TOKEN, user: users.find(u => u.id === 'u1') });
    return;
  }

  const token = generateToken(user.id);
  tokens.set(token, user);

  res.json({ token, user });
});

app.get('/me', protect, (req: Request, res: Response) => {
  // The user is attached by the 'protect' middleware
  return res.json({ user: (req as AuthRequest).user });
});

// Search for users
app.get('/api/users/search', protect, (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.json({ items: [] });
  }

  const lowerCaseQuery = query.toLowerCase().trim();
  const results = demoUsers
    .filter(u => u.id !== (req as AuthRequest).user!.id) // Don't return the user themselves
    .filter(u =>
      u.name.toLowerCase().includes(lowerCaseQuery) ||
      (u.gamerTag && u.gamerTag.toLowerCase().includes(lowerCaseQuery))
    );

  res.json({ items: results });
});

// --- User Routes ---
const userRouter = express.Router();

userRouter.put('/profile', protect, (req: Request, res: Response) => {
  const { displayName, gamerTag, avatarUrl } = req.body;
  const user = (req as AuthRequest).user; // User is attached from the 'protect' middleware

  if (!user) {
    return res.status(401).json({ error: 'No user on request' });
  }

  if (!displayName || !gamerTag) {
    return res.status(400).json({ error: 'Display name and gamer tag are required' });
  }

  // Update the user object in the 'users' and 'demoUsers' arrays
  const userIndex = users.findIndex(u => u.id === user.id);
  const demoUserIndex = demoUsers.findIndex(u => u.id === user.id);

  const updatedUser: User = {
    ...user,
    name: displayName, // 'name' is used in other parts of the demo app
    displayName,
    gamerTag,
    avatarUrl: avatarUrl || user.avatarUrl,
    onboarded: true,
  };

  if (userIndex !== -1) {
    users[userIndex] = updatedUser;
  }
  if (demoUserIndex !== -1) {
    demoUsers[demoUserIndex] = updatedUser;
  }

  console.log('Updated user profile:', updatedUser);

  res.json({ user: updatedUser });
});

app.use('/api/user', userRouter);

app.post('/posts', protect, (req: Request, res: Response) => {
  const { contentText, gameTags = [], media = [], city } = req.body || {};
  const user = (req as AuthRequest).user!;
  const post: Post = {
    id: `p${Date.now()}`,
    authorId: user.id,
    user,
    contentText: contentText ?? '',
    media,
    gameTags,
    location: { city: city ?? user.city },
    createdAt: new Date().toISOString(),
    likesCount: 0,
    commentsCount: 0,
    viewsCount: 0,
    visibility: 'public',
    kind: 'post'
  };
  demoPosts.unshift(post);
  return res.status(201).json({ post });
});

app.get('/conversations', protect, (req: Request, res: Response) => {
  // In a real app, you'd fetch conversations for req.user.id
  // For this demo, we'll create some if they don't exist.
  if (!conversationsStore.size) {
    const demoConvos: Conversation[] = [
      { id: 'c1', title: 'ProGamer123', gameTag: 'Valorant', extraTag: 'Diamond II', snippet: "Ready for ranked? Let's push to Immortal!", time: new Date(Date.now() - 120000).toISOString(), unread: 2, members: [(req as AuthRequest).user!, demoUsers[0]] },
      { id: 'c2', title: 'Diamond Demons', isGroup: true, membersCount: 5, gameTag: 'BGMI', snippet: 'GG everyone! Same time tomorrow?', time: new Date(Date.now() - 900000).toISOString(), members: [(req as AuthRequest).user!, ...demoUsers.slice(1, 5)] },
      { id: 'c3', title: 'SkillShot', gameTag: 'Apex Legends', snippet: 'That clutch was insane!', time: new Date(Date.now() - 86400000).toISOString(), members: [(req as AuthRequest).user!, demoUsers[5]] },
    ];
    demoConvos.forEach(c => conversationsStore.set(c.id, c));
  }
  res.json({ items: Array.from(conversationsStore.values()) });
});

app.get('/conversations/:id/messages', protect, (req: Request, res: Response) => {
  const { id } = req.params;
  if (!messagesStore.has(id)) {
    // Create demo messages for the first time
    const demoMsgs: Message[] = [
      { id: `m_${Date.now()}`, text: "Ready for ranked? Let's push to Immortal!", user: demoUsers[0], createdAt: new Date(Date.now() - 120000).toISOString() },
      { id: `m_${Date.now() + 1}`, text: "I'm down! Hopping on now.", user: (req as AuthRequest).user!, createdAt: new Date(Date.now() - 60000).toISOString() },
    ];
    messagesStore.set(id, demoMsgs);
  }
  res.json({ items: messagesStore.get(id) || [] });
});

app.post('/conversations/:id/messages', protect, (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text_required' });

  const message: Message = { id: `m_${Date.now()}`, text, user: (req as AuthRequest).user!, createdAt: new Date().toISOString() };
  const messages = messagesStore.get(id) || [];
  messages.push(message);
  messagesStore.set(id, messages);

  // Also update the conversation snippet
  if (conversationsStore.has(id)) {
    const convo = conversationsStore.get(id)!;
    convo.snippet = text;
    convo.time = message.createdAt;
  }

  res.status(201).json({ message });
});

app.get('/api/clans/my', protect, (req: Request, res: Response) => {
  const userClans = Array.from(clansStore.values()).filter(c => c.members?.includes((req as AuthRequest).user!.id));
  res.json({ items: userClans });
});

app.post('/api/clans/:id/join', protect, (req: Request, res: Response) => {
  const clan = clansStore.get(req.params.id);
  if (!clan) {
    return res.status(404).json({ error: 'clan_not_found' });
  }
  if (clan.members?.includes((req as AuthRequest).user!.id)) {
    return res.status(400).json({ error: 'already_a_member' });
  }
  if (clan.membersCount >= clan.membersMax) {
    return res.status(400).json({ error: 'clan_is_full' });
  }

  clan.members.push((req as AuthRequest).user!.id);
  clan.membersCount++;
  res.json({ clan });
});

app.post('/api/clans/:id/leave', protect, (req: Request, res: Response) => {
  const clan = clansStore.get(req.params.id);
  if (!clan) {
    return res.status(404).json({ error: 'clan_not_found' });
  }

  const memberIndex = clan.members?.indexOf((req as AuthRequest).user!.id);
  if (memberIndex === -1 || memberIndex === undefined) {
    return res.status(400).json({ error: 'not_a_member' });
  }

  clan.members.splice(memberIndex, 1);
  clan.membersCount--;
  res.json({ clan });
});

app.post('/api/clans/:id/invites', protect, (req: Request, res: Response) => {
  const clan = clansStore.get(req.params.id);
  const { userId } = req.body; // ID of the user to invite

  if (!clan) {
    return res.status(404).json({ error: 'clan_not_found' });
  }
  // For simplicity, any member can invite. In a real app, you'd check for roles.
  if (!clan.members?.includes((req as AuthRequest).user!.id)) {
    return res.status(403).json({ error: 'not_clan_member' });
  }
  const userToInvite = demoUsers.find(u => u.id === userId);
  if (!userToInvite) {
    return res.status(404).json({ error: 'user_not_found' });
  }
  if (clan.members?.includes(userId)) {
    return res.status(400).json({ error: 'user_already_in_clan' });
  }

  // Check for existing pending invite
  const existingInvite = Array.from(invitesStore.values()).find(inv => inv.clanId === clan.id && inv.userId === userId && inv.status === 'pending');
  if (existingInvite) {
    return res.status(400).json({ error: 'invite_already_sent' });
  }

  const newInvite: Invite = {
    id: `inv${Date.now()}`,
    clanId: clan.id,
    clanName: clan.name,
    userId: userToInvite.id,
    inviterId: (req as AuthRequest).user!.id,
    inviterName: (req as AuthRequest).user!.name,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  invitesStore.set(newInvite.id, newInvite);
  console.log(`User ${(req as AuthRequest).user!.name} invited ${userToInvite.name} to clan ${clan.name}`);
  res.status(201).json({ invite: newInvite });
});

app.get('/api/invites', protect, (req: Request, res: Response) => {
  const userInvites = Array.from(invitesStore.values()).filter(
    (invite) => invite.userId === (req as AuthRequest).user!.id && invite.status === 'pending'
  );
  res.json({ items: userInvites });
});

app.post('/api/invites/:id/accept', protect, (req: Request, res: Response) => {
  const invite = invitesStore.get(req.params.id);

  if (!invite || invite.userId !== (req as AuthRequest).user!.id) {
    return res.status(404).json({ error: 'invite_not_found' });
  }
  if (invite.status !== 'pending') {
    return res.status(400).json({ error: 'invite_not_pending' });
  }

  const clan = clansStore.get(invite.clanId);
  if (!clan) {
    invite.status = 'expired'; // Clan was deleted
    return res.status(404).json({ error: 'clan_not_found' });
  }
  if (clan.membersCount >= clan.membersMax) {
    return res.status(400).json({ error: 'clan_is_full' });
  }
  if (clan.members?.includes((req as AuthRequest).user!.id)) {
    invite.status = 'accepted'; // Already a member, just resolve the invite
    return res.status(400).json({ error: 'already_a_member' });
  }

  invite.status = 'accepted';
  clan.members.push((req as AuthRequest).user!.id);
  clan.membersCount++;

  console.log(`User ${(req as AuthRequest).user!.name} accepted invite to clan ${clan.name}`);
  res.json({ clan });
});

app.post('/api/invites/:id/reject', protect, (req: Request, res: Response) => {
  const invite = invitesStore.get(req.params.id);

  if (!invite || invite.userId !== (req as AuthRequest).user!.id) {
    return res.status(404).json({ error: 'invite_not_found' });
  }
  if (invite.status !== 'pending') {
    return res.status(400).json({ error: 'invite_not_pending' });
  }

  invite.status = 'rejected';
  console.log(`User ${(req as AuthRequest).user!.name} rejected invite to clan ${clansStore.get(invite.clanId)?.name}`);
  res.json({ ok: true });
});

app.get('/users/nearby', protect, (req: Request, res: Response) => {
  const currentUser = (req as AuthRequest).user!;
  // Corrected: usersStore does not exist, using the `users` array instead.
  const allUsers = users;

  const nearbyUsers = allUsers
    .filter(user => user.id !== currentUser.id)
    .map(user => {
      // Simulate distance for demo purposes
      const distance = (Math.random() * 15 + 1).toFixed(1);
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatarUrl,
        distance: `${distance} km`,
        location: user.location || { city: 'Unknown', country: 'Unknown' },
        // Add any other fields needed by the frontend card
        roles: 'Casual Games',
        tags: [{ label: 'Valorant' }, { label: 'Diamond II' }],
      };
    });

  res.json({ items: nearbyUsers });
});

app.post('/posts/:id/comments', protect, (req: Request, res: Response) => {
  const p = demoPosts.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'not_found' });
  const { text } = req.body || {};
  const user = (req as AuthRequest).user!;
  if (!text || String(text).trim().length === 0) return res.status(400).json({ error: 'text_required' });
  const comment: Comment = { id: `c${Date.now()}`, user, text: String(text), createdAt: new Date().toISOString() };
  const list = commentsStore.get(req.params.id) || [];
  list.unshift(comment);
  commentsStore.set(req.params.id, list);
  p.commentsCount = (p.commentsCount || 0) + 1;
  return res.status(201).json({ comment });
});

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('sendMessage', (data) => {
    const { conversationId, message } = data;
    const messages = messagesStore.get(conversationId) || [];
    messages.push(message);
    messagesStore.set(conversationId, messages);

    // In a real app, you'd emit to a room
    socket.broadcast.emit('newMessage', { conversationId, message });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  seedInitialData();
  console.log(`gameotion demo server listening on :${PORT}`);
});
