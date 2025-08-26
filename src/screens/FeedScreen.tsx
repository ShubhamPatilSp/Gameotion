import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View, Image, TouchableOpacity, Alert, Modal, TextInput, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Pressable, StatusBar, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { gamerTheme } from '@/theme/theme';
import { useAuth } from '@/store/auth';
import api from '@/api/client';
import EventCard from '@/components/Feed/EventCard';
import HeaderBar from '@/components/Feed/HeaderBar';
import StoriesStrip, { DEMO_STORIES } from '@/components/Feed/StoriesStrip';
import FilterBar from '@/components/Feed/FilterBar';
import PostMetaBar from '@/components/Feed/PostMetaBar';
// ComposerBar removed per design
import LiveBanner from '@/components/Feed/LiveBanner';
import PostHeader from '@/components/Feed/PostHeader';
import CommentsSheet from '@/components/Feed/CommentsSheet';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFeedPage, type FeedItem, addComment, listComments, sharePost, likePost, unlikePost } from '@/api/feed';

type Media = { url: string; type: 'image' | 'video' };
type Post = {
  id: string;
  authorId: string;
  user: { id: string; name: string; avatarUrl: string };
  contentText: string;
  media: Media[];
  gameTags: string[];
  location?: { city?: string };
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  visibility?: string;
};

export default function FeedScreen() {
  // Define fallback first so we can seed initial UI
  const fallbackPosts: Partial<Post>[] = [
    // Two unique offline posts used only when server is offline
    {
      id: 'offline-1',
      user: { id: 'u1', name: 'NovaStriker', avatarUrl: 'https://i.pravatar.cc/100?img=65' },
      contentText: 'Ace clutch on Haven! #Valorant',
      media: [{ url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1470&auto=format&fit=crop', type: 'image' }],
      gameTags: ['valorant'],
      likesCount: 231,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'offline-2',
      user: { id: 'u2', name: 'ShadowFox', avatarUrl: 'https://i.pravatar.cc/100?img=12' },
      contentText: 'Predator grind continues. Any tips?',
      media: [{ url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1470&auto=format&fit=crop', type: 'image' }],
      gameTags: ['apex'],
      likesCount: 127,
      createdAt: new Date().toISOString(),
    },
  ];

  const [posts, setPosts] = useState<Post[]>(fallbackPosts as any);
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState<boolean>(true);
  const user = useAuth((s) => s.user);
  const [filters, setFilters] = useState<{ scope: 'all' | 'friends' | 'nearby' | 'tournaments' | 'clips'; game?: string }>({ scope: 'all' });

  const {
    data,
    isFetching,
    isRefetching,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<{ items: FeedItem[]; nextPage: number | null }>({
    queryKey: ['feed', filters, user?.location?.city],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchFeedPage({
      page: Number(pageParam || 1),
      limit: 15,
      filters,
      preferredCity: user?.location?.city,
    }),
    getNextPageParam: (last) => last?.nextPage ?? null,
    staleTime: 15_000,
    retry: 0,
  });

  useEffect(() => {
    if (isError) {
      setOnline(false);
      setPosts(fallbackPosts as any);
      return;
    }
    if (!data) return;
    const merged = data.pages.flatMap((p) => (p?.items ?? [])).filter(Boolean) as any;
    setPosts(merged);
    setOnline(true);
  }, [data, isError]);

  const renderPost = (item: Post) => (
    <PostItem item={item} />
  );

  function PostItem({ item }: { item: Post }) {
    const [likes, setLikes] = React.useState<number>(item.likesCount || 0);
    const [comments, setComments] = React.useState<number>(item.commentsCount || 0);
    const [bookmarked, setBookmarked] = React.useState<boolean>(false);
    const [liked, setLiked] = React.useState<boolean>(false);
    const views = (item as any).viewsCount || 0;
    const [shares, setShares] = React.useState<number>(Math.floor(views / 20));
    const [showComment, setShowComment] = React.useState(false);
        const handleLike = () => {
      const originalLiked = liked;
      const originalLikes = likes;

      setLiked(!originalLiked);
      setLikes((n) => (originalLiked ? Math.max(0, n - 1) : n + 1));

      const apiCall = originalLiked ? unlikePost(item.id) : likePost(item.id);
      apiCall.catch(() => {
        setLiked(originalLiked);
        setLikes(originalLikes);
        Alert.alert('Error', 'Could not update like status.');
      });
    };
    const handleComment = () => setShowComment(true);
    const handleShare = async () => {
      try {
        // Optimistic UI update
        setShares((n) => n + 1);
        // Notify backend (demo increments viewsCount)
        void sharePost(item.id).catch(() => {});
        // Open native share sheet
        const url = item.media?.[0]?.url;
        const message = `${item.contentText ?? ''}${item.contentText ? '\n\n' : ''}${url ?? ''}`.trim();
        await Share.share({ message, title: 'Share post' });
      } catch (e) {
        // no-op; keep UX simple
      }
    };

    const [showOptions, setShowOptions] = React.useState(false);
    return (
    <View style={styles.card}>
        <PostHeader name={item.user.name} avatar={item.user.avatarUrl} gameTag={item.gameTags?.[0]} createdAt={item.createdAt} live={item.user.name === 'SkillShot'} onOptions={() => setShowOptions(true)} />
        <Text style={styles.caption}>{item.contentText}</Text>
      {item.media?.[0]?.url ? (
        <Image source={{ uri: item.media[0].url }} style={styles.media} resizeMode="cover" />
      ) : null}
        <PostMetaBar
          likes={likes}
          comments={comments}
          shares={shares}
          bookmarked={bookmarked}
          liked={liked}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onSave={() => setBookmarked((b) => !b)}
        />
        <OptionsSheet
          visible={showOptions}
          onClose={() => setShowOptions(false)}
          onAction={(action) => {
            setShowOptions(false);
            if (action === 'save') setBookmarked(true);
            if (action === 'share') handleShare();
            if (action === 'copy') { /* noop */ }
          }}
        />
        <CommentsSheet
          visible={showComment}
          postId={item.id}
          onClose={() => setShowComment(false)}
          onPosted={() => setComments((n) => n + 1)}
        />
      </View>
    );
  }


type OptionsSheetProps = { visible: boolean; onClose: () => void; onAction: (a: 'save' | 'report' | 'copy' | 'share') => void };

function OptionsSheet({ visible, onClose, onAction }: OptionsSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.sheetBackdrop}>
          <View style={styles.optSheet}>
            <TouchableOpacity style={styles.optRow} onPress={() => onAction('save')}>
              <Icon name="bookmark-outline" size={18} color={gamerTheme.colors.textPrimary} /><Text style={styles.optText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optRow} onPress={() => onAction('share')}>
              <Icon name="share-outline" size={18} color={gamerTheme.colors.textPrimary} /><Text style={styles.optText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optRow} onPress={() => onAction('copy')}>
              <Icon name="link-variant" size={18} color={gamerTheme.colors.textPrimary} /><Text style={styles.optText}>Copy Link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optRow, { borderTopColor: gamerTheme.colors.border, borderTopWidth: 1 }]} onPress={() => onAction('report')}>
              <Icon name="alert-circle-outline" size={18} color="#FF6B6B" /><Text style={[styles.optText, { color: '#FF6B6B' }]}>Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// ---- Stories Viewer (demo) ----
type StoriesViewerHandle = { open: (startIndex: number) => void };

const StoriesViewerModal = React.forwardRef<StoriesViewerHandle, {}>(function StoriesViewerModal(_props, ref) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [itemIndex, setItemIndex] = React.useState(0);
  const current = DEMO_STORIES[index];
  const items = current?.items || [];
  const [paused, setPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const startRef = React.useRef<number>(0);
  const [replyText, setReplyText] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [sentAck, setSentAck] = React.useState<string | null>(null);

  React.useImperativeHandle(ref, () => ({
    open: (startIndex: number) => {
      setIndex(startIndex);
      setItemIndex(0);
      setVisible(true);
      setPaused(false);
    },
  }));

  React.useEffect(() => {
    if (!visible) return;
    const dur = items[itemIndex]?.durationMs || 4000;
    startRef.current = Date.now();
    setProgress(0);
    const tick = setInterval(() => {
      if (paused) return;
      const p = Math.min(1, (Date.now() - startRef.current) / dur);
      setProgress(p);
      if (p >= 1) {
        clearInterval(tick);
        if (itemIndex + 1 < items.length) setItemIndex((i) => i + 1);
        else if (index + 1 < DEMO_STORIES.length) { setIndex((i) => i + 1); setItemIndex(0); }
        else setVisible(false);
      }
    }, 50);
    return () => clearInterval(tick);
  }, [visible, index, itemIndex, paused]);

  const onTapLeft = () => {
    if (itemIndex > 0) setItemIndex((i) => i - 1);
    else if (index > 0) { const prev = index - 1; setIndex(prev); setItemIndex((DEMO_STORIES[prev].items.length - 1) || 0); }
  };
  const onTapRight = () => {
    if (itemIndex + 1 < items.length) setItemIndex((i) => i + 1);
    else if (index + 1 < DEMO_STORIES.length) { setIndex((i) => i + 1); setItemIndex(0); }
    else setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || sending) return;
    try {
      setSending(true);
      const text = replyText.trim();
      setReplyText('');
      setSentAck('Sent');
      setTimeout(() => setSentAck(null), 1200);
      // In a real app, send to backend here with story id: DEMO_STORIES[index].id
    } finally {
      setSending(false);
    }
  };

  const handleQuickReaction = (emoji: string) => {
    setSentAck(emoji);
    setTimeout(() => setSentAck(null), 1000);
    // In a real app, send quick reaction to backend
  };

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.storiesBackdrop}>
        {items[itemIndex]?.url ? (
          <Image source={{ uri: items[itemIndex].url }} style={styles.storyImage} resizeMode="cover" />
        ) : null}
        <LinearGradient colors={["rgba(0,0,0,0.75)", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[styles.overlayTop, { height: insets.top + 120 }]} />
        <View style={[styles.storiesTopRow, { top: insets.top + 6 }]}>
          <View style={{ flexDirection: 'row', gap: 4, flex: 1 }}>
            {items.map((_, i) => (
              <View key={i} style={styles.progressBarWrap}>
                <View style={[styles.progressBarBg]} />
                <View style={[styles.progressFill, i < itemIndex && { width: '100%' }, i === itemIndex && { width: `${Math.max(0, Math.min(100, progress * 100))}%` }]} />
              </View>
            ))}
          </View>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={handleClose}>
            <Icon name="close" color="#fff" size={22} />
          </TouchableOpacity>
        </View>
        <View style={[styles.storiesHeader, { top: insets.top + 30 }] }>
          {current?.avatar ? <Image source={{ uri: current.avatar }} style={styles.commentAvatar} /> : null}
          <Text style={{ color: '#fff', fontWeight: '800' }}>{current?.name}</Text>
        </View>
        <Pressable style={styles.tapLeft} onPress={onTapLeft} onPressIn={() => setPaused(true)} onPressOut={() => setPaused(false)} />
        <Pressable style={styles.tapRight} onPress={onTapRight} onPressIn={() => setPaused(true)} onPressOut={() => setPaused(false)} />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.6)"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.overlayBottom} />
        {sentAck ? (
          <View style={[styles.storyToast, { bottom: (insets.bottom || 12) + 84 }]}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>{sentAck}</Text>
          </View>
        ) : null}

        <View style={[styles.storyReplyWrap, { paddingBottom: (insets.bottom || 0) + 12 }]}>
          <View style={styles.storyQuickRow}>
            {['❤️','👏','🔥','😂','😮','😢'].map((e) => (
              <TouchableOpacity key={e} style={styles.storyQuickChip} onPress={() => handleQuickReaction(e)}>
                <Text style={{ fontSize: 16 }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.storyReplyRow}>
            <TextInput
              style={styles.storyInput}
              value={replyText}
              onChangeText={setReplyText}
              placeholder="Send message"
              placeholderTextColor="rgba(255,255,255,0.7)"
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            />
            <TouchableOpacity disabled={!replyText.trim() || sending} onPress={handleSendReply}>
              <View style={[styles.storySendBtn, { opacity: replyText.trim() && !sending ? 1 : 0.5 }]}>
                <Icon name="send" size={18} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <StatusBar barStyle="light-content" hidden />
      </View>
    </Modal>
  );
});

  const storiesRef = React.useRef<StoriesViewerHandle>(null);
  const renderItem = ({ item }: { item: any }) => {
    if (item.kind === 'stories') {
      return <StoriesStrip onOpen={(idx) => storiesRef.current?.open(idx)} />;
    }
    if (item.kind === 'event') {
      return (
        <EventCard title={item.title} gameTag={item.gameTag} startsAt={item.startsAt} city={item.city} cta={item.cta} />
      );
    }
    return renderPost(item as Post);
  };

  return (
    <View style={{ flex: 1, backgroundColor: gamerTheme.colors.background }}>
      <HeaderBar />
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12, paddingTop: 8, minHeight: 300 }}
        ListHeaderComponent={(
          <View style={{ marginHorizontal: -12, backgroundColor: gamerTheme.colors.background }}>
            <LiveBanner onPress={() => {}} />
      <FilterBar active={filters} onChange={setFilters} />
          </View>
        )}
        stickyHeaderIndices={[0]}
        data={useMemo(() => [{ id: '__stories__', kind: 'stories' }, ...posts as any], [posts])}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        initialNumToRender={8}
        windowSize={10}
        maxToRenderPerBatch={8}
        removeClippedSubviews
        updateCellsBatchingPeriod={50}
        onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl tintColor={gamerTheme.colors.textSecondary} refreshing={isRefetching || isFetching} onRefresh={() => refetch()} />}
      />
      <StoriesViewerModal ref={storiesRef} />
      {/* ComposerBar removed */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: gamerTheme.colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: gamerTheme.colors.border,
  },
  headerRowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  gameTag: {
    color: gamerTheme.colors.textSecondary,
    fontSize: 12,
  },
  media: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  caption: {
    color: gamerTheme.colors.textPrimary,
    marginBottom: 6,
  },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheetGradient: { marginHorizontal: 12, borderRadius: 16, padding: 1, marginBottom: 8 },
  sheetInner: { backgroundColor: gamerTheme.colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: gamerTheme.colors.border },
  sheetTitle: { color: gamerTheme.colors.textPrimary, fontWeight: '900', marginBottom: 8 },
  commentsHeader: { color: gamerTheme.colors.textSecondary, marginBottom: 8 },
  commentsList: { maxHeight: 260, borderWidth: 1, borderColor: gamerTheme.colors.border, borderRadius: 12, padding: 10, backgroundColor: '#0E0E16', marginBottom: 12 },
  commentRow: { flexDirection: 'row', gap: 10 },
  commentAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#0E0E16' },
  commentName: { color: gamerTheme.colors.textPrimary, fontWeight: '800' },
  commentTime: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  commentText: { color: gamerTheme.colors.textPrimary },
  inputBox: { minHeight: 86, borderWidth: 1, borderColor: gamerTheme.colors.border, borderRadius: 12, padding: 12, color: gamerTheme.colors.textPrimary, backgroundColor: '#0E0E16', marginBottom: 10 },
  sheetFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  charCount: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  postBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  igSheet: { backgroundColor: gamerTheme.colors.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 12, borderWidth: 1, borderColor: gamerTheme.colors.border },
  igHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: gamerTheme.colors.border, alignSelf: 'center', marginBottom: 8 },
  igHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 6 },
  igListWrap: { maxHeight: 360, paddingHorizontal: 4, marginBottom: 8 },
  igInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  igInput: { flex: 1, minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: gamerTheme.colors.border, paddingHorizontal: 12, paddingVertical: 10, color: gamerTheme.colors.textPrimary, backgroundColor: '#0E0E16' },
  storiesBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,1)' },
  storiesTopRow: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
  overlayTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 120 },
  overlayBottom: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 120 },
  progressBarWrap: { flex: 1, height: 3, position: 'relative', overflow: 'hidden', borderRadius: 2 },
  progressBarBg: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.25)' },
  progressFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: '#fff' },
  storiesHeader: { position: 'absolute', left: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  tapLeft: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '40%' },
  tapRight: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '60%' },
  storyImage: { flex: 1 },
  storyReplyWrap: { position: 'absolute', left: 12, right: 12, bottom: 0 },
  storyQuickRow: { flexDirection: 'row', gap: 8, marginBottom: 8, justifyContent: 'center' },
  storyQuickChip: { backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  storyReplyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  storyInput: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, color: '#fff' },
  storySendBtn: { backgroundColor: 'rgba(255,255,255,0.25)', padding: 10, borderRadius: 18 },
  storyToast: { position: 'absolute', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: gamerTheme.colors.textSecondary,
  },
  optSheet: { marginHorizontal: 16, borderRadius: 16, backgroundColor: gamerTheme.colors.surface, borderWidth: 1, borderColor: gamerTheme.colors.border, overflow: 'hidden' },
  optRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  optText: { color: gamerTheme.colors.textPrimary, fontWeight: '700' },
  commentActions: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 },
  commentLike: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentLikeText: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  replyText: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  replyingTo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: gamerTheme.colors.border, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  replyingToText: { color: gamerTheme.colors.textSecondary, fontSize: 12, flex: 1 },
  replyInputContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: gamerTheme.colors.border },
  replyInputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  replyAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: gamerTheme.colors.border },
  replyInput: { flex: 1, minHeight: 36, borderRadius: 12, borderWidth: 1, borderColor: gamerTheme.colors.border, paddingHorizontal: 10, paddingVertical: 8, color: gamerTheme.colors.textPrimary, backgroundColor: '#0E0E16', fontSize: 14 },
  replyPostBtn: { padding: 8 },
  cancelReplyBtn: { alignSelf: 'flex-end', marginTop: 8 },
  cancelReplyText: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  repliesToggle: { flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  repliesLine: { width: 20, height: 1, backgroundColor: gamerTheme.colors.border, marginRight: 8 },
  repliesToggleText: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  repliesContainer: { marginLeft: 20, marginTop: 8 },
  replyRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  replyName: { color: gamerTheme.colors.textPrimary, fontWeight: '700', fontSize: 13 },
  replyTime: { color: gamerTheme.colors.textSecondary, fontSize: 11 },
  replyActions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
  replyLike: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  replyLikeText: { color: gamerTheme.colors.textSecondary, fontSize: 11 },
  replyReplyText: { color: gamerTheme.colors.textSecondary, fontSize: 11 },
  replyPostingText: { color: gamerTheme.colors.textSecondary, fontSize: 12, fontWeight: '600' },
  
});


