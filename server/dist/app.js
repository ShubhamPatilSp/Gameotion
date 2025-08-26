"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let demoUsers = [];
const users = []; // In-memory user store
const demoPosts = [];
// In-memory stores
const commentsStore = new Map();
const conversationsStore = new Map();
const messagesStore = new Map();
const clansStore = new Map();
const invitesStore = new Map();
const tokens = new Map(); // token -> user
const STATIC_DEV_TOKEN = 'dev-token-for-user-1';
function seedInitialData() {
    // Seed a default user for stable development
    if (users.length === 0) {
        const defaultUser = {
            id: 'u1',
            email: 'dev@gameotion.com',
            password: 'password',
            name: 'shubham',
            displayName: 'shubham',
            gamerTag: 'ProGamer123',
            isVerified: true,
            avatarUrl: 'https://i.pravatar.cc/150?u=shubham',
            isOnline: true,
            gameTags: ['Valorant', 'Immortal I'],
            bio: 'Immortal Valorant player | Content creator | Looking for serious squad',
            followers: 2847,
            following: 156,
            level: 42,
            location: 'Mumbai, India',
            joined: 'Jan 2024',
            stats: {
                winRate: '73%',
                kdRatio: '1.85',
                hoursPlayed: '847h',
                matches: '1,234',
            },
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
        var _a, _b, _c;
        const ageHours = (nowTs - new Date(p.createdAt).getTime()) / (1000 * 60 * 60);
        const recencyScore = Math.max(0, 1 - ageHours / 24); // 0..1
        const isCity = city && (((_a = p.location) === null || _a === void 0 ? void 0 : _a.city) || p.city) && String(city).toLowerCase() === String(((_b = p.location) === null || _b === void 0 ? void 0 : _b.city) || p.city).toLowerCase();
        const isFriend = String(friends) === 'true' && p.kind === 'post' && ((_c = demoUsers.find((u) => u.id === p.authorId)) === null || _c === void 0 ? void 0 : _c.friends);
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
    if (!p)
        return res.status(404).json({ error: 'not_found' });
    p.likesCount = Math.max(0, (p.likesCount || 0) + (action === 'unlike' ? -1 : 1));
    return res.json({ likesCount: p.likesCount });
});
app.post('/posts/:id/bookmark', (req, res) => {
    // demo: no persistence, just echo
    const exists = !!demoPosts.find((x) => x.id === req.params.id);
    if (!exists)
        return res.status(404).json({ error: 'not_found' });
    return res.json({ ok: true });
});
app.post('/posts/:id/share', (req, res) => {
    const p = demoPosts.find((x) => x.id === req.params.id);
    if (!p)
        return res.status(404).json({ error: 'not_found' });
    p.viewsCount = (p.viewsCount || 0) + 1;
    return res.json({ viewsCount: p.viewsCount });
});
// User endpoints for profile + posts
app.get('/users/:id', (req, res) => {
    const user = users.find((u) => u.id === req.params.id);
    if (!user)
        return res.status(404).json({ error: 'not_found' });
    // Ensure all new fields are included in the response
    const userProfile = Object.assign(Object.assign({}, user), { name: user.displayName || user.name });
    return res.json({ user: userProfile });
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
        .filter(u => u.name.toLowerCase().includes(lowerCaseQuery) ||
        (u.gamerTag && u.gamerTag.toLowerCase().includes(lowerCaseQuery)));
    res.json({ items: results });
});
// --- User Routes ---
const userRouter = express_1.default.Router();
userRouter.put('/profile', protect, (req, res) => {
    const { displayName, gamerTag, avatarUrl } = req.body;
    const user = req.user; // User is attached from the 'protect' middleware
    if (!user) {
        return res.status(401).json({ error: 'No user on request' });
    }
    if (!displayName || !gamerTag) {
        return res.status(400).json({ error: 'Display name and gamer tag are required' });
    }
    // Update the user object in the 'users' and 'demoUsers' arrays
    const userIndex = users.findIndex(u => u.id === user.id);
    const demoUserIndex = demoUsers.findIndex(u => u.id === user.id);
    const updatedUser = Object.assign(Object.assign({}, user), { name: displayName, // 'name' is used in other parts of the demo app
        displayName,
        gamerTag, avatarUrl: avatarUrl || user.avatarUrl, onboarded: true });
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
    }
    if (demoUserIndex !== -1) {
        demoUsers[demoUserIndex] = updatedUser;
    }
    console.log('Updated user profile:', updatedUser);
    res.json({ user: updatedUser });
});
app.get('/api/notifications', protect, (req, res) => {
    res.json({ items: mockNotifications });
});
app.use('/api/user', userRouter);
app.post('/posts', protect, (req, res) => {
    const { contentText, gameTags = [], media = [], city } = req.body || {};
    const user = req.user;
    const post = {
        id: `p${Date.now()}`,
        authorId: user.id,
        user,
        contentText: contentText !== null && contentText !== void 0 ? contentText : '',
        media,
        gameTags,
        location: { city: city !== null && city !== void 0 ? city : user.city },
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
app.post('/conversations/:id/messages', protect, (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    if (!text)
        return res.status(400).json({ error: 'text_required' });
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
app.get('/api/clans/my', protect, (req, res) => {
    const userClans = Array.from(clansStore.values()).filter(c => { var _a; return (_a = c.members) === null || _a === void 0 ? void 0 : _a.includes(req.user.id); });
    res.json({ items: userClans });
});
app.post('/api/clans/:id/join', protect, (req, res) => {
    var _a;
    const clan = clansStore.get(req.params.id);
    if (!clan) {
        return res.status(404).json({ error: 'clan_not_found' });
    }
    if ((_a = clan.members) === null || _a === void 0 ? void 0 : _a.includes(req.user.id)) {
        return res.status(400).json({ error: 'already_a_member' });
    }
    if (clan.membersCount >= clan.membersMax) {
        return res.status(400).json({ error: 'clan_is_full' });
    }
    clan.members.push(req.user.id);
    clan.membersCount++;
    res.json({ clan });
});
app.post('/api/clans/:id/leave', protect, (req, res) => {
    var _a;
    const clan = clansStore.get(req.params.id);
    if (!clan) {
        return res.status(404).json({ error: 'clan_not_found' });
    }
    const memberIndex = (_a = clan.members) === null || _a === void 0 ? void 0 : _a.indexOf(req.user.id);
    if (memberIndex === -1 || memberIndex === undefined) {
        return res.status(400).json({ error: 'not_a_member' });
    }
    clan.members.splice(memberIndex, 1);
    clan.membersCount--;
    res.json({ clan });
});
app.post('/api/clans/:id/invites', protect, (req, res) => {
    var _a, _b;
    const clan = clansStore.get(req.params.id);
    const { userId } = req.body; // ID of the user to invite
    if (!clan) {
        return res.status(404).json({ error: 'clan_not_found' });
    }
    // For simplicity, any member can invite. In a real app, you'd check for roles.
    if (!((_a = clan.members) === null || _a === void 0 ? void 0 : _a.includes(req.user.id))) {
        return res.status(403).json({ error: 'not_clan_member' });
    }
    const userToInvite = demoUsers.find(u => u.id === userId);
    if (!userToInvite) {
        return res.status(404).json({ error: 'user_not_found' });
    }
    if ((_b = clan.members) === null || _b === void 0 ? void 0 : _b.includes(userId)) {
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
app.get('/api/invites', protect, (req, res) => {
    const userInvites = Array.from(invitesStore.values()).filter((invite) => invite.userId === req.user.id && invite.status === 'pending');
    res.json({ items: userInvites });
});
app.post('/api/invites/:id/accept', protect, (req, res) => {
    var _a;
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
    if ((_a = clan.members) === null || _a === void 0 ? void 0 : _a.includes(req.user.id)) {
        invite.status = 'accepted'; // Already a member, just resolve the invite
        return res.status(400).json({ error: 'already_a_member' });
    }
    invite.status = 'accepted';
    clan.members.push(req.user.id);
    clan.membersCount++;
    console.log(`User ${req.user.name} accepted invite to clan ${clan.name}`);
    res.json({ clan });
});
app.post('/api/invites/:id/reject', protect, (req, res) => {
    var _a;
    const invite = invitesStore.get(req.params.id);
    if (!invite || invite.userId !== req.user.id) {
        return res.status(404).json({ error: 'invite_not_found' });
    }
    if (invite.status !== 'pending') {
        return res.status(400).json({ error: 'invite_not_pending' });
    }
    invite.status = 'rejected';
    console.log(`User ${req.user.name} rejected invite to clan ${(_a = clansStore.get(invite.clanId)) === null || _a === void 0 ? void 0 : _a.name}`);
    res.json({ ok: true });
});
app.get('/users/nearby', protect, (req, res) => {
    const currentUser = req.user;
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
app.post('/posts/:id/comments', protect, (req, res) => {
    const p = demoPosts.find((x) => x.id === req.params.id);
    if (!p)
        return res.status(404).json({ error: 'not_found' });
    const { text } = req.body || {};
    const user = req.user;
    if (!text || String(text).trim().length === 0)
        return res.status(400).json({ error: 'text_required' });
    const comment = { id: `c${Date.now()}`, user, text: String(text), createdAt: new Date().toISOString() };
    const list = commentsStore.get(req.params.id) || [];
    list.unshift(comment);
    commentsStore.set(req.params.id, list);
    p.commentsCount = (p.commentsCount || 0) + 1;
    return res.status(201).json({ comment });
});
const mockNotifications = [
    {
        id: '1',
        type: 'follow',
        user: { id: 'u2', name: 'kaushallchaudhari', avatarUrl: 'https://i.pravatar.cc/100?img=2' },
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    },
    {
        id: '2',
        type: 'like',
        user: { id: 'u3', name: 'dhrumilvyas_3012', avatarUrl: 'https://i.pravatar.cc/100?img=3' },
        post: { id: 'p1', text: 'Check out my new setup! 🚀' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    },
    {
        id: '3',
        type: 'comment',
        user: { id: 'u4', name: 'gaming_pro', avatarUrl: 'https://i.pravatar.cc/100?img=4' },
        post: { id: 'p1', text: 'Check out my new setup! 🚀' },
        comment: 'That looks amazing! What keyboard is that?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    },
    {
        id: '4',
        type: 'follow',
        user: { id: 'u5', name: 'valorant_fan', avatarUrl: 'https://i.pravatar.cc/100?img=5' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
];
const io = new socket_io_1.Server(server, {
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
