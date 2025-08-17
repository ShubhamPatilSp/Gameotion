import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View, Image, TouchableOpacity, Alert, Modal, TextInput, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Pressable, StatusBar, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { gamerTheme } from '@/theme/theme';
import { useProfile } from '@/store/profile';
import api from '@/api/client';
import EventCard from '@/components/Feed/EventCard';
import HeaderBar from '@/components/Feed/HeaderBar';
import StoriesStrip, { DEMO_STORIES } from '@/components/Feed/StoriesStrip';
import FilterBar from '@/components/Feed/FilterBar';
import PostMetaBar from '@/components/Feed/PostMetaBar';
// ComposerBar removed per design
import LiveBanner from '@/components/Feed/LiveBanner';
import PostHeader from '@/components/Feed/PostHeader';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFeedPage, type FeedItem, addComment, listComments, sharePost } from '@/api/feed';

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
  const profile = useProfile((s) => s.profile);
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
    queryKey: ['feed', filters, profile.location?.city],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchFeedPage({
      page: Number(pageParam || 1),
      limit: 15,
      filters,
      preferredCity: profile.location?.city,
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
    const handleLike = () => { setLikes((n) => (liked ? Math.max(0, n - 1) : n + 1)); setLiked((v) => !v); };
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

function formatRelative(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diffMs / (1000 * 60));
  if (m < 1) return 'now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

type CommentsSheetProps = { visible: boolean; postId: string; onClose: () => void; onPosted: () => void };

function CommentsSheet({ visible, postId, onClose, onPosted }: CommentsSheetProps) {
  const [commentsList, setCommentsList] = React.useState<any[]>([]);
  const [loadingComments, setLoadingComments] = React.useState(false);
  const [posting, setPosting] = React.useState(false);
  const [text, setText] = React.useState('');
  const listRef = React.useRef<FlatList<any>>(null);
  const inputRef = React.useRef<TextInput>(null);
  const serverBacked = !String(postId).startsWith('offline-');

  // Demo comments for better UX
  const demoComments = [
    {
      id: 'demo-1',
      user: { id: 'u1', name: 'bharat_prajapati_007', avatarUrl: 'https://i.pravatar.cc/100?img=1' },
      text: 'Placement',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      likes: 1,
    },
    {
      id: 'demo-2',
      user: { id: 'u2', name: 'kaushallchaudhari', avatarUrl: 'https://i.pravatar.cc/100?img=2' },
      text: 'Placement',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 17).toISOString(), // 17 hours ago
      likes: 1,
    },
    {
      id: 'demo-3',
      user: { id: 'u3', name: 'dhrumilvyas_3012', avatarUrl: 'https://i.pravatar.cc/100?img=3' },
      text: 'Placement',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
      likes: 1,
    },
    {
      id: 'demo-4',
      user: { id: 'u4', name: 'gaming_pro', avatarUrl: 'https://i.pravatar.cc/100?img=4' },
      text: 'Nice clutch! 🔥',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      likes: 3,
    },
    {
      id: 'demo-5',
      user: { id: 'u5', name: 'valorant_fan', avatarUrl: 'https://i.pravatar.cc/100?img=5' },
      text: 'Haven is my favorite map!',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      likes: 2,
    },
  ];

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!visible) return;
      try {
        setLoadingComments(true);
        setCommentsList([]);
        if (serverBacked) {
          const items = await listComments(postId);
          if (mounted) setCommentsList(items);
        } else {
          // For offline posts, show demo comments
          if (mounted) setCommentsList(demoComments);
        }
      } catch {
        // If server fails, show demo comments
        if (mounted) setCommentsList(demoComments);
      } finally { 
        if (mounted) setLoadingComments(false); 
      }
    };
    load();
    return () => { mounted = false; };
  }, [visible, postId]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.sheetBackdrop}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.igSheet}>
              <View style={styles.igHandle} />
              <View style={styles.igHeaderRow}>
                <Text style={styles.sheetTitle}>Comments</Text>
                <Icon name="close" size={20} color={gamerTheme.colors.textSecondary} onPress={onClose} />
              </View>
              <View style={styles.igListWrap}>
                {loadingComments ? (
                  <Text style={{ color: gamerTheme.colors.textSecondary }}>Loading…</Text>
                ) : commentsList.length === 0 ? (
                  <Text style={{ color: gamerTheme.colors.textSecondary }}>Be the first to comment</Text>
                ) : (
                  <FlatList
                    ref={listRef}
                    data={commentsList}
                    keyExtractor={(c) => c.id}
                                         renderItem={({ item }) => <CommentRow c={item} onReply={() => {}} />}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    contentContainerStyle={{ paddingBottom: 8 }}
                    keyboardShouldPersistTaps="handled"
                  />
                )}
              </View>
                             <View style={styles.igInputRow}>
                 <TextInput
                   ref={inputRef}
                   value={text}
                   onChangeText={setText}
                   placeholder="Add a comment..."
                   placeholderTextColor={gamerTheme.colors.textSecondary}
                   style={styles.igInput}
                   multiline
                   maxLength={240}
                 />
                <TouchableOpacity
                  disabled={!text.trim() || posting}
                  onPress={async () => {
                    if (!text.trim()) return;
                    try {
                      setPosting(true);
                      let created: any = null;
                      if (serverBacked) {
                        created = await addComment(postId, text.trim());
                      } else {
                        created = { id: `c${Date.now()}`, user: { id: 'you', name: 'You', avatarUrl: 'https://i.pravatar.cc/100?img=5' }, text: text.trim(), createdAt: new Date().toISOString() };
                      }
                      setCommentsList((prev) => [created, ...prev]);
                      onPosted();
                      setText('');
                      requestAnimationFrame(() => listRef.current?.scrollToOffset({ offset: 0, animated: true }));
                    } catch (e) {
                      if (serverBacked) Alert.alert('Failed', 'Could not post your comment. Please try again.');
                    } finally {
                      setPosting(false);
                    }
                  }}
                >
                  <LinearGradient colors={[gamerTheme.colors.primary, '#19D3DA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.postBtn, { opacity: text.trim() && !posting ? 1 : 0.5 }]}>
                    <Text style={{ color: '#fff', fontWeight: '900' }}>{posting ? 'Posting…' : 'Post'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function CommentRow({ c, onReply }: { c: any; onReply: (commentId: string, username: string) => void }) {
  const [liked, setLiked] = React.useState(false);
  const [likes, setLikes] = React.useState(c.likes || 0);
  const [showReplyInput, setShowReplyInput] = React.useState(false);
  const [replyText, setReplyText] = React.useState('');
  const [showReplies, setShowReplies] = React.useState(true);
  const [replies, setReplies] = React.useState<any[]>([]);
  const [postingReply, setPostingReply] = React.useState(false);

  // Demo replies for the comment - these would come from the server
  const demoReplies = [
    {
      id: 'reply-1',
      user: { id: 'u6', name: 'theunkownlegacy', avatarUrl: 'https://i.pravatar.cc/100?img=6' },
      text: `@${c.user?.name} new video on Paraboy 🧑‍🦰`,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(), // 4 weeks ago
      likes: 149,
      liked: false,
    },
    {
      id: 'reply-2',
      user: { id: 'u7', name: 'justz_bishal', avatarUrl: 'https://i.pravatar.cc/100?img=7' },
      text: `@${c.user?.name} bhai Wo Toh best Rahega hamesha 💀`,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days ago
      likes: 23,
      liked: false,
    }
  ];

  // Initialize replies with demo data
  React.useEffect(() => {
    setReplies(demoReplies);
  }, []);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  const handleReply = () => {
    setShowReplyInput(true);
  };

  const handlePostReply = async () => {
    if (!replyText.trim()) return;
    
    try {
      setPostingReply(true);
      
      // Create new reply object
      const newReply = {
        id: `reply-${Date.now()}`,
        user: { 
          id: 'current-user', 
          name: 'You', 
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' 
        },
        text: replyText.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
        liked: false,
      };

      // Add to replies list
      setReplies(prev => [newReply, ...prev]);
      
      // Clear input and close
      setReplyText('');
      setShowReplyInput(false);
      
      // Here you would typically post to server
      // await addReply(c.id, replyText.trim());
      
    } catch (error) {
      console.error('Failed to post reply:', error);
    } finally {
      setPostingReply(false);
    }
  };

  const handleReplyLike = (replyId: string) => {
    setReplies(prev => prev.map(reply => {
      if (reply.id === replyId) {
        return {
          ...reply,
          liked: !reply.liked,
          likes: reply.liked ? reply.likes - 1 : reply.likes + 1
        };
      }
      return reply;
    }));
  };

  const handleReplyReply = (replyId: string, username: string) => {
    setReplyText(`@${username} `);
    setShowReplyInput(true);
  };

  return (
    <View style={styles.commentRow}>
      <Image source={{ uri: c.user?.avatarUrl }} style={styles.commentAvatar} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.commentName}>{c.user?.name}</Text>
          <Text style={styles.commentTime}>{formatRelative(c.createdAt)}</Text>
          <Icon name="heart" size={16} color="#FF6B6B" />
        </View>
        <Text style={styles.commentText}>{c.text}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentLike} onPress={handleLike}>
            <Icon name={liked ? "heart" : "heart-outline"} size={16} color={liked ? "#FF6B6B" : gamerTheme.colors.textSecondary} />
            <Text style={styles.commentLikeText}>{likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReply}>
            <Text style={styles.replyText}>Reply</Text>
          </TouchableOpacity>
        </View>
        
        {/* Show replies toggle */}
        {replies.length > 0 && (
          <TouchableOpacity 
            style={styles.repliesToggle} 
            onPress={() => setShowReplies(!showReplies)}
          >
            <View style={styles.repliesLine} />
            <Text style={styles.repliesToggleText}>
              {showReplies ? 'Hide replies' : `Show ${replies.length} replies`}
            </Text>
          </TouchableOpacity>
        )}

        {/* Replies section */}
        {showReplies && replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {replies.map((reply) => (
              <View key={reply.id} style={styles.replyRow}>
                <Image source={{ uri: reply.user.avatarUrl }} style={styles.replyAvatar} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.replyName}>{reply.user.name}</Text>
                    <Text style={styles.replyTime}>{formatRelative(reply.createdAt)}</Text>
                    <Icon name="heart" size={14} color="#FF6B6B" />
                  </View>
                  <Text style={styles.replyText}>{reply.text}</Text>
                  <View style={styles.replyActions}>
                    <TouchableOpacity 
                      style={styles.replyLike} 
                      onPress={() => handleReplyLike(reply.id)}
                    >
                      <Icon 
                        name={reply.liked ? "heart" : "heart-outline"} 
                        size={14} 
                        color={reply.liked ? "#FF6B6B" : gamerTheme.colors.textSecondary} 
                      />
                      <Text style={[styles.replyLikeText, { color: reply.liked ? "#FF6B6B" : gamerTheme.colors.textSecondary }]}>
                        {reply.likes}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleReplyReply(reply.id, reply.user.name)}>
                      <Text style={styles.replyReplyText}>Reply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* Reply input appears below the comment */}
        {showReplyInput && (
          <View style={styles.replyInputContainer}>
            <View style={styles.replyInputRow}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }} style={styles.replyAvatar} />
              <TextInput
                style={styles.replyInput}
                placeholder={`Reply to @${c.user?.name}...`}
                placeholderTextColor={gamerTheme.colors.textSecondary}
                value={replyText}
                onChangeText={setReplyText}
                multiline
                maxLength={200}
                editable={!postingReply}
              />
              <TouchableOpacity 
                style={styles.replyPostBtn} 
                onPress={handlePostReply}
                disabled={!replyText.trim() || postingReply}
              >
                {postingReply ? (
                  <Text style={styles.replyPostingText}>...</Text>
                ) : (
                  <Icon 
                    name="send" 
                    size={16} 
                    color={replyText.trim() && !postingReply ? gamerTheme.colors.primary : gamerTheme.colors.textSecondary} 
                  />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.cancelReplyBtn} 
              onPress={() => {
                setShowReplyInput(false);
                setReplyText('');
              }}
              disabled={postingReply}
            >
              <Text style={styles.cancelReplyText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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


