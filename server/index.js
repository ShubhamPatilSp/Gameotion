const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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

const now = Date.now();
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

// In-memory comments per post (demo only)
const commentsStore = new Map();

// Auto-extend demo feed with more content for smoother, realistic scrolling
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

// --- Simple OTP Auth (demo-only, in-memory) ---
const otpStore = new Map(); // email -> { code, expiresAt }
const tokens = new Map(); // token -> user

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateToken(userId) {
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

app.post('/auth/request-otp', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });
  const code = generateCode();
  otpStore.set(email, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
  // In real life, send via email/SMS. For demo, return code in response.
  return res.json({ ok: true, code });
});

app.post('/auth/verify-otp', (req, res) => {
  const { email, code } = req.body || {};
  const record = otpStore.get(email);
  if (!record || record.code !== code || Date.now() > record.expiresAt) {
    return res.status(400).json({ error: 'invalid_code' });
  }
  otpStore.delete(email);
  // Create or lookup user
  const user = demoUsers[0];
  const token = generateToken(user.id);
  tokens.set(token, user);
  return res.json({ token, user });
});

app.get('/me', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  const user = tokens.get(token);
  if (!user) return res.status(401).json({ error: 'unauthorized' });
  return res.json({ user });
});

app.post('/posts', (req, res) => {
  const { contentText, gameTags = [], media = [], city } = req.body || {};
  const user = demoUsers[Math.floor(Math.random() * demoUsers.length)];
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

app.post('/posts/:id/comments', (req, res) => {
  const p = demoPosts.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'not_found' });
  const { text, user = { id: 'you', name: 'You', avatarUrl: 'https://i.pravatar.cc/100?img=5' } } = req.body || {};
  if (!text || String(text).trim().length === 0) return res.status(400).json({ error: 'text_required' });
  const comment = { id: `c${Date.now()}`, user, text: String(text), createdAt: new Date().toISOString() };
  const list = commentsStore.get(req.params.id) || [];
  list.unshift(comment);
  commentsStore.set(req.params.id, list);
  p.commentsCount = (p.commentsCount || 0) + 1;
  return res.status(201).json({ comment });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`gameotion demo server listening on :${PORT}`);
});


