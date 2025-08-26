const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

/*
const demoUsers = [
  { id: 'u1', name: 'NovaStriker', avatarUrl: 'https://i.pravatar.cc/100?img=65', city: 'Delhi', friends: true },
  { id: 'u2', name: 'ShadowFox', avatarUrl: 'https://i.pravatar.cc/100?img=12', city: 'Mumbai', friends: false },
  { id: 'u3', name: 'ArcMage', avatarUrl: 'https://i.pravatar.cc/100?img=30', city: 'Delhi', friends: false },
  // Suggested players
  { id: 'su1', name: 'ProGamer123', avatarUrl: 'https://i.pravatar.cc/100?img=11', city: 'Mumbai', friends: false },
  { id: 'su2', name: 'SkillShot', avatarUrl: 'https://i.pravatar.cc/100?img=22', city: 'Delhi', friends: false },
  { id: 'su3', name: 'NinjaPlayer', avatarUrl: 'https://i.pravatar.cc/100?img=33', city: 'Bangalore', friends: false },
  { id: 'su4', name: 'GameMaster', avatarUrl: 'https://i.pravatar.cc/100?img=44', city: 'Chennai', friends: false },
  { id: 'su5', name: 'ShadowFoxX', avatarUrl: 'https://i.pravatar.cc/100?img=15', city: 'Pune', friends: false },
];
*/
let demoUsers = [];
const users = []; // In-memory user store
const clans = []; // In-memory clan store

const now = Date.now();
/*
const demoPosts = [
  {
    id: 'p1', kind: 'post',
    authorId: 'u1',
    user: demoUsers[0],
    contentText: 'Ace clutch on Haven! #Valorant',
    media: [{ url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1470&auto=format&fit=crop', type: 'image' }],
    gameTags: ['valorant'],
    location: { city: 'Delhi' },
    createdAt: new Date(now - 1000 * 60 * 60).toISOString(),
    likesCount: 231,
    commentsCount: 18,
    viewsCount: 5400,
    visibility: 'public',
  },
  {
    id: 'p2', kind: 'post',
    authorId: 'u2',
    user: demoUsers[1],
    contentText: 'Predator grind continues. Any tips?',
    media: [{ url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1470&auto=format&fit=crop', type: 'image' }],
    gameTags: ['apex'],
    location: { city: 'Mumbai' },
    createdAt: new Date(now - 1000 * 60 * 90).toISOString(),
    likesCount: 127,
    commentsCount: 9,
    viewsCount: 2700,
    visibility: 'public',
  },
  // Demo with LIVE badge
  {
    id: 'p4', kind: 'post',
    authorId: 'su2',
    user: demoUsers.find(u => u.id === 'su2'),
    contentText: 'Squad looking for one more for ranked push. Must have mic and good vibes only!',
    media: [],
    gameTags: ['bgmi'],
    location: { city: 'Delhi' },
    createdAt: new Date(now - 1000 * 60 * 240).toISOString(),
    likesCount: 324,
    commentsCount: 45,
    viewsCount: 1200,
    visibility: 'public',
  },
  {
    id: 'p3', kind: 'post',
    authorId: 'u3',
    user: demoUsers[2],
    contentText: 'Finally beat Malenia. GG! ⚔️',
    media: [],
    gameTags: ['elden_ring'],
    location: { city: 'Delhi' },
    createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
    likesCount: 402,
    commentsCount: 53,
    viewsCount: 6200,
    visibility: 'public',
  },
  // Tournament win announcement
  {
    id: 'p5', kind: 'post',
    authorId: 'su1',
    user: demoUsers.find(u => u.id === 'su1'),
    contentText: 'Champions! Won the Valorant Summer Championship 🏆 Thanks to everyone who cheered us on! #Valorant #TournamentWin',
    media: [{ url: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1470&auto=format&fit=crop', type: 'image' }],
    gameTags: ['valorant'],
    location: { city: 'Mumbai' },
    createdAt: new Date(now - 1000 * 60 * 70).toISOString(),
    likesCount: 1280,
    commentsCount: 234,
    viewsCount: 5400,
    visibility: 'public',
  },
  // Gaming post about strategy
  {
    id: 'p6', kind: 'post',
    authorId: 'su3',
    user: demoUsers.find(u => u.id === 'su3'),
    contentText: 'CS2 strat drop: fast A split worked like a charm today. Smokes lineup in comments. 💨',
    media: [],
    gameTags: ['cs2'],
    location: { city: 'Bangalore' },
    createdAt: new Date(now - 1000 * 60 * 180).toISOString(),
    likesCount: 640,
    commentsCount: 76,
    viewsCount: 3800,
    visibility: 'public',
  },
  // BGMI highlight image
  {
    id: 'p7', kind: 'post',
    authorId: 'su4',
    user: demoUsers.find(u => u.id === 'su4'),
    contentText: 'BGMI cafe scrims were lit! Pulled a 14-kill chicken dinner. 🐔',
    media: [{ url: 'https://images.unsplash.com/photo-1603484477859-abe6a73f9361?q=80&w=1470&auto=format&fit=crop', type: 'image' }],
    gameTags: ['bgmi'],
    location: { city: 'Chennai' },
    createdAt: new Date(now - 1000 * 60 * 200).toISOString(),
    likesCount: 980,
    commentsCount: 120,
    viewsCount: 7200,
    visibility: 'public',
  },
  // CODM clutch
  {
    id: 'p8', kind: 'post',
    authorId: 'su5',
    user: demoUsers.find(u => u.id === 'su5'),
    contentText: 'COD Mobile clutch 1v3 on Summit. What a rush! 🎮',
    media: [{ url: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1470&auto=format&fit=crop', type: 'image' }],
    gameTags: ['cod_mobile'],
    location: { city: 'Pune' },
    createdAt: new Date(now - 1000 * 60 * 260).toISOString(),
    likesCount: 420,
    commentsCount: 39,
    viewsCount: 2500,
    visibility: 'public',
  },
  // Event card example
  {
    id: 'e1', kind: 'event',
    title: 'Valorant Community Cup — 32 teams',
    gameTag: 'valorant',
    startsAt: new Date(now + 1000 * 60 * 60 * 6).toISOString(),
    city: 'Delhi',
    cta: 'Register',
    engagementHint: 87,
    createdAt: new Date(now - 1000 * 60 * 50).toISOString(),
  },
];
*/
const demoPosts = [];

// In-memory comments per post (demo only)
const commentsStore = new Map();
const conversationsStore = new Map();
const messagesStore = new Map();
const clansStore = new Map();
const invitesStore = new Map();

function seedInitialData() {
  // Seed a default user for stable development
  if (users.length === 0) {
    const defaultUser = {
      id: 'u1',
      email: 'dev@gameotion.com',
      password: 'password',
      name: 'Dev User',
      avatarUrl: 'https://i.pravatar.cc/100?u=dev@gameotion.com',
      onboarded: true,
    };
    const demoUser2 = {
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
    const demoClans = [
      { id: 'cl1', name: 'Neon Warriors', tag: 'NEON', level: 15, region: 'Asia', gameTags: ['Valorant', 'Diamond'], description: 'Elite Valorant clan looking for Diamond+ players. Active daily, tournaments every weekend.', membersCount: 127, membersMax: 150, founded: '2023', requirements: ['Diamond+ rank', '18+ age', 'active daily'], recruiting: true, members: [] },
      { id: 'cl2', name: 'Shadow Legends', tag: 'SHDW', level: 12, region: 'India', gameTags: ['BGMI', 'Platinum'], description: 'Multi-game competitive clan. BGMI, COD Mobile, and more. Family-friendly community.', membersCount: 89, membersMax: 100, founded: '2024', requirements: ['Platinum+ rank', 'good attitude'], recruiting: true, members: [] },
      { id: 'cl3', name: 'Cyber Phoenixes', tag: 'CYBER', level: 25, region: 'Global', gameTags: ['Multiple', 'Immortal'], description: 'High-level multi-game clan with weekly events and scrims.', membersCount: 210, membersMax: 250, founded: '2021', requirements: ['Immortal+ rank', 'scrim-ready'], recruiting: false, members: [] },
    ];
    demoClans.forEach(c => clansStore.set(c.id, c));
    console.log('✅ Demo clans seeded.');
  }
}

/* // Auto-extend demo feed with more content for smoother, realistic scrolling
const sampleTexts = [
  'Just hit Immortal! The grind was real but totally worth it 🔥',
  'That flick was insane. Clipped it for later!',
  'Tournament practice tonight — need a fifth.',
  'New crosshair settings feel so good.',
  'Streaming in 10 – drop by and say hi!',
  'Who is up for scrims this weekend?',
  'Ranked grind continues. One more win for promo!',
  'Finally beat the boss. GG!',
];
const sampleImages = [
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1612197527762-8cfb55b6183a?q=80&w=1470&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1470&auto=format&fit=crop',
];
const sampleGames = ['valorant', 'apex', 'elden_ring', 'cs2', 'lol'];
const sampleCities = ['Delhi', 'Mumbai', 'Bangalore'];

for (let i = 0; i < 24; i++) {
  const user = demoUsers[i % demoUsers.length];
  const img = sampleImages[i % sampleImages.length];
  const game = sampleGames[i % sampleGames.length];
  const city = sampleCities[i % sampleCities.length];
  demoPosts.push({
    id: `p${100 + i}`,
    kind: 'post',
    authorId: user.id,
    user,
    contentText: sampleTexts[i % sampleTexts.length],
    media: [{ url: img, type: 'image' }],
    gameTags: [game],
    location: { city },
    createdAt: new Date(now - 1000 * 60 * (20 + i * 7)).toISOString(),
    likesCount: 20 + (i % 90),
    commentsCount: 2 + (i % 25),
    viewsCount: 200 + i * 15,
    visibility: 'public',
  });
}

// Add a couple of extra event cards
demoPosts.push({
  id: 'e2', kind: 'event',
  title: 'BGMI City Qualifiers — 64 teams',
  gameTag: 'bgmi',
  startsAt: new Date(now + 1000 * 60 * 60 * 24).toISOString(),
  city: 'Mumbai',
  cta: 'Register',
  engagementHint: 42,
  createdAt: new Date(now - 1000 * 60 * 120).toISOString(),
});
demoPosts.push({
  id: 'e3', kind: 'event',
  title: 'CS2 LAN Night',
  gameTag: 'cs2',
  startsAt: new Date(now + 1000 * 60 * 60 * 48).toISOString(),
  city: 'Bangalore',
  cta: 'Join',
  engagementHint: 33,
  createdAt: new Date(now - 1000 * 60 * 200).toISOString(),
});

// Seed demo comments for a professional feel
const sampleComments = [
  'GG! That was insane 🔥',
  'Congrats on the win! 🏆',
  'Teach me your crosshair settings please!',
  'That clutch had me on the edge!',
  'Let’s squad up later?',
  'Clean headshots. Respect.',
];
function seedComments() {
  const posts = demoPosts.filter((p) => p.kind === 'post');
  posts.slice(0, 15).forEach((p, idx) => {
    if (commentsStore.has(p.id)) return;
    const n = 3 + (idx % 3); // 3-5 comments
    const list = [];
    for (let i = 0; i < n; i++) {
      const user = demoUsers[(i + idx) % demoUsers.length];
      list.push({
        id: `c_seed_${p.id}_${i}`,
        user: { id: user.id, name: user.name, avatarUrl: user.avatarUrl },
        text: sampleComments[(i + idx) % sampleComments.length],
        createdAt: new Date(now - 1000 * 60 * (5 + i * 7)).toISOString(),
      });
    }
    commentsStore.set(p.id, list);
    p.commentsCount = (p.commentsCount || 0) + list.length;
  });
}
seedComments();
*/

app.get('/health', (req, res) => res.json({ ok: true }));

// Ranked feed: /feed?game=valorant&city=Delhi&page=1&limit=10
app.get('/feed', (req, res) => {
  const { game, city, page = 1, limit = 10, friends } = req.query;
  const w1 = 0.5; // recency
  const w2 = 0.3; // user match (game/city/friends)
  const w3 = 0.2; // engagement
  const nowTs = Date.now();

  let items = demoPosts.slice();
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

app.get('/posts', (req, res) => {
  return res.json({ posts: demoPosts });
});

// Lightweight interactions (demo-only)
app.post('/posts/:id/like', (req, res) => {
  const { action } = req.body || {};
  const p = demoPosts.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'not_found' });
  p.likesCount = Math.max(0, (p.likesCount || 0) + (action === 'unlike' ? -1 : 1));
  return res.json({ likesCount: p.likesCount });
});

app.post('/posts/:id/bookmark', (req, res) => {
  // demo: no persistence, just echo
  const exists = !!demoPosts.find((x) => x.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'not_found' });
  return res.json({ ok: true });
});

app.post('/posts/:id/share', (req, res) => {
  const p = demoPosts.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'not_found' });
  p.viewsCount = (p.viewsCount || 0) + 1;
  return res.json({ viewsCount: p.viewsCount });
});

// User endpoints for profile + posts
app.get('/users/:id', (req, res) => {
  const user = demoUsers.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'not_found' });
  return res.json({ user });
});

app.get('/users/:id/posts', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const items = demoPosts.filter((p) => p.authorId === req.params.id);
  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);
  const pageItems = items.slice(start, end);
  const nextPage = end < items.length ? Number(page) + 1 : null;
  return res.json({ items: pageItems, nextPage });
});

// --- Simple Email/Password Auth (demo-only, in-memory) ---
const tokens = new Map(); // token -> user
const STATIC_DEV_TOKEN = 'dev-token-for-user-1';

// Middleware to protect routes
const protect = (req, res, next) => {
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

  req.user = fullUser;
  next();
};

function generateToken(userId) {
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

app.post('/auth/signup', (req, res) => {
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

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user.id);
  tokens.set(token, user);

    // For development, you can log in with any email/password
  // and you will be logged in as the default user.
  res.json({ token: STATIC_DEV_TOKEN, user: users.find(u => u.id === 'u1') });
});

app.get('/me', protect, (req, res) => {
  // The user is attached by the 'protect' middleware
  return res.json({ user: req.user });
});

// Search for users
app.get('/api/users/search', protect, (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.json({ items: [] });
  }

  const lowerCaseQuery = query.toLowerCase().trim();
  const results = demoUsers
    .filter(u => u.id !== req.user.id) // Don't return the user themselves
    .filter(u =>
      u.name.toLowerCase().includes(lowerCaseQuery) ||
      (u.gamerTag && u.gamerTag.toLowerCase().includes(lowerCaseQuery))
    );

  res.json({ items: results });
});

// --- User Routes ---
const userRouter = express.Router();

userRouter.put('/profile', protect, (req, res) => {
  const { displayName, gamerTag, avatarUrl } = req.body;
  const user = req.user; // User is attached from the 'protect' middleware

  if (!displayName || !gamerTag) {
    return res.status(400).json({ error: 'Display name and gamer tag are required' });
  }

  // Update the user object in the 'users' and 'demoUsers' arrays
  const userIndex = users.findIndex(u => u.id === user.id);
  const demoUserIndex = demoUsers.findIndex(u => u.id === user.id);

  const updatedUser = {
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

app.post('/posts', protect, (req, res) => {
  const { contentText, gameTags = [], media = [], city } = req.body || {};
  const user = req.user;
  const post = {
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
  };
  demoPosts.unshift(post);
  return res.status(201).json({ post });
});

// Add a simple comment (demo only increments count)
app.post('/posts/:id/comment', (req, res) => {
  const p = demoPosts.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'not_found' });
  p.commentsCount = (p.commentsCount || 0) + 1;
  return res.json({ commentsCount: p.commentsCount });
});

// Full comments API (demo)
app.get('/posts/:id/comments', (req, res) => {
  let items = commentsStore.get(req.params.id) || [];
  // If empty, auto-generate a small set so demo always shows content
  if (!items.length) {
    const user = demoUsers.find((u) => u.id === 'u1') || demoUsers[0];
    items = [
      { id: `c_auto_${Date.now()}`, user: { id: user.id, name: user.name, avatarUrl: user.avatarUrl }, text: sampleComments[0], createdAt: new Date().toISOString() },
      { id: `c_auto_${Date.now()}_2`, user: { id: demoUsers[1].id, name: demoUsers[1].name, avatarUrl: demoUsers[1].avatarUrl }, text: sampleComments[1], createdAt: new Date(Date.now() - 600000).toISOString() },
      { id: `c_auto_${Date.now()}_3`, user: { id: demoUsers[2].id, name: demoUsers[2].name, avatarUrl: demoUsers[2].avatarUrl }, text: sampleComments[2], createdAt: new Date(Date.now() - 1200000).toISOString() },
    ];
    commentsStore.set(req.params.id, items);
    const p = demoPosts.find((x) => x.id === req.params.id);
    if (p) p.commentsCount = (p.commentsCount || 0) + items.length;
  }
  return res.json({ items });
});

// --- Chat / DM Endpoints ---

// Get all conversations for the logged-in user
app.get('/conversations', protect, (req, res) => {
  // In a real app, you'd fetch conversations for req.user.id
  // For this demo, we'll create some if they don't exist.
  if (!conversationsStore.size) {
    const demoConvos = [
      { id: 'c1', title: 'ProGamer123', gameTag: 'Valorant', extraTag: 'Diamond II', snippet: "Ready for ranked? Let's push to Immortal!", time: new Date(Date.now() - 120000).toISOString(), unread: 2, members: [req.user, demoUsers[0]] },
      { id: 'c2', title: 'Diamond Demons', isGroup: true, membersCount: 5, gameTag: 'BGMI', snippet: 'GG everyone! Same time tomorrow?', time: new Date(Date.now() - 900000).toISOString(), members: [req.user, ...demoUsers.slice(1, 5)] },
      { id: 'c3', title: 'SkillShot', gameTag: 'Apex Legends', snippet: 'That clutch was insane!', time: new Date(Date.now() - 86400000).toISOString(), members: [req.user, demoUsers[5]] },
    ];
    demoConvos.forEach(c => conversationsStore.set(c.id, c));
  }
  res.json({ items: Array.from(conversationsStore.values()) });
});

// Get all messages for a specific conversation
app.get('/conversations/:id/messages', protect, (req, res) => {
  const { id } = req.params;
  if (!messagesStore.has(id)) {
    // Create demo messages for the first time
    const demoMsgs = [
      { id: `m_${Date.now()}`, text: "Ready for ranked? Let's push to Immortal!", user: demoUsers[0], createdAt: new Date(Date.now() - 120000).toISOString() },
      { id: `m_${Date.now() + 1}`, text: "I'm down! Hopping on now.", user: req.user, createdAt: new Date(Date.now() - 60000).toISOString() },
    ];
    messagesStore.set(id, demoMsgs);
  }
  res.json({ items: messagesStore.get(id) || [] });
});

// Send a message in a conversation
app.post('/conversations/:id/messages', protect, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text_required' });

  const message = { id: `m_${Date.now()}`, text, user: req.user, createdAt: new Date().toISOString() };
  const messages = messagesStore.get(id) || [];
  messages.push(message);
  messagesStore.set(id, messages);

  // Also update the conversation snippet
  if (conversationsStore.has(id)) {
    const convo = conversationsStore.get(id);
    convo.snippet = text;
    convo.time = message.createdAt;
  }

  res.status(201).json({ message });
});

// --- Clans / Groups Endpoints ---

// Get all clans
app.get('/api/clans', (req, res) => {
  res.json({ items: Array.from(clansStore.values()) });
});

// Create a new clan
app.post('/api/clans', protect, (req, res) => {
  const { name, tag, description } = req.body;
  if (!name || !tag) {
    return res.status(400).json({ error: 'name_and_tag_required' });
  }

  const newClan = {
    id: `cl${Date.now()}`,
    name,
    tag,
    description,
    level: 1,
    region: req.user.location?.country || 'Global',
    gameTags: [],
    membersCount: 1,
    membersMax: 50,
    founded: new Date().getFullYear().toString(),
    requirements: [],
    recruiting: true,
    members: [req.user.id],
  };

  clansStore.set(newClan.id, newClan);
  res.status(201).json({ clan: newClan });
});

// Get clans for the current user
app.get('/api/clans/my', protect, (req, res) => {
  const userClans = Array.from(clansStore.values()).filter(c => c.members?.includes(req.user.id));
  res.json({ items: userClans });
});

// Join a clan
app.post('/api/clans/:id/join', protect, (req, res) => {
  const clan = clansStore.get(req.params.id);
  if (!clan) {
    return res.status(404).json({ error: 'clan_not_found' });
  }
  if (clan.members?.includes(req.user.id)) {
    return res.status(400).json({ error: 'already_a_member' });
  }
  if (clan.membersCount >= clan.membersMax) {
    return res.status(400).json({ error: 'clan_is_full' });
  }

  clan.members.push(req.user.id);
  clan.membersCount++;
  res.json({ clan });
});

// Leave a clan
app.post('/api/clans/:id/leave', protect, (req, res) => {
  const clan = clansStore.get(req.params.id);
  if (!clan) {
    return res.status(404).json({ error: 'clan_not_found' });
  }

  const memberIndex = clan.members?.indexOf(req.user.id);
  if (memberIndex === -1) {
    return res.status(400).json({ error: 'not_a_member' });
  }

  clan.members.splice(memberIndex, 1);
  clan.membersCount--;
  res.json({ clan });
});

// --- Clan Invites Endpoints ---

// Invite a user to a clan
app.post('/api/clans/:id/invites', protect, (req, res) => {
  const clan = clansStore.get(req.params.id);
  const { userId } = req.body; // ID of the user to invite

  if (!clan) {
    return res.status(404).json({ error: 'clan_not_found' });
  }
  // For simplicity, any member can invite. In a real app, you'd check for roles.
  if (!clan.members?.includes(req.user.id)) {
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

  const newInvite = {
    id: `inv${Date.now()}`,
    clanId: clan.id,
    clanName: clan.name,
    userId: userToInvite.id,
    inviterId: req.user.id,
    inviterName: req.user.name,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  invitesStore.set(newInvite.id, newInvite);
  console.log(`User ${req.user.name} invited ${userToInvite.name} to clan ${clan.name}`);
  res.status(201).json({ invite: newInvite });
});

// Get pending invites for the current user
app.get('/api/invites', protect, (req, res) => {
  const userInvites = Array.from(invitesStore.values()).filter(
    (invite) => invite.userId === req.user.id && invite.status === 'pending'
  );
  res.json({ items: userInvites });
});

// Accept an invitation
app.post('/api/invites/:id/accept', protect, (req, res) => {
  const invite = invitesStore.get(req.params.id);

  if (!invite || invite.userId !== req.user.id) {
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
  if (clan.members?.includes(req.user.id)) {
    invite.status = 'accepted'; // Already a member, just resolve the invite
    return res.status(400).json({ error: 'already_a_member' });
  }

  invite.status = 'accepted';
  clan.members.push(req.user.id);
  clan.membersCount++;

  console.log(`User ${req.user.name} accepted invite to clan ${clan.name}`);
  res.json({ clan });
});

// Reject an invitation
app.post('/api/invites/:id/reject', protect, (req, res) => {
  const invite = invitesStore.get(req.params.id);

  if (!invite || invite.userId !== req.user.id) {
    return res.status(404).json({ error: 'invite_not_found' });
  }
  if (invite.status !== 'pending') {
    return res.status(400).json({ error: 'invite_not_pending' });
  }

  invite.status = 'rejected';
  console.log(`User ${req.user.name} rejected invite to clan ${clansStore.get(invite.clanId)?.name}`);
  res.json({ ok: true });
});

// --- Users Endpoints ---

// Get nearby users
app.get('/users/nearby', protect, (req, res) => {
  const currentUser = req.user;
  const allUsers = Array.from(usersStore.values());

  const nearbyUsers = allUsers
    .filter(user => user.id !== currentUser.id)
    .map(user => {
      // Simulate distance for demo purposes
      const distance = (Math.random() * 15 + 1).toFixed(1);
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        distance: `${distance} km`,
        location: user.location || { city: 'Unknown', country: 'Unknown' },
        // Add any other fields needed by the frontend card
        roles: 'Casual Games',
        tags: [{ label: 'Valorant' }, { label: 'Diamond II' }],
      };
    });

  res.json({ items: nearbyUsers });
});

app.post('/api/posts/:id/comments', protect, (req, res) => {
  const p = demoPosts.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'not_found' });
    const { text } = req.body || {};
  const user = req.user;
  if (!text || String(text).trim().length === 0) return res.status(400).json({ error: 'text_required' });
  const comment = { id: `c${Date.now()}`, user, text: String(text), createdAt: new Date().toISOString() };
  const list = commentsStore.get(req.params.id) || [];
  list.unshift(comment);
  commentsStore.set(req.params.id, list);
  p.commentsCount = (p.commentsCount || 0) + 1;
  return res.status(201).json({ comment });
});

const io = new Server(server, {
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


