import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { gamerTheme } from '@/theme/theme';
import { addComment, listComments } from '@/api/feed';

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

export default function CommentsSheet({ visible, postId, onClose, onPosted }: CommentsSheetProps) {
  const [commentsList, setCommentsList] = React.useState<any[]>([]);
  const [loadingComments, setLoadingComments] = React.useState(false);
  const [posting, setPosting] = React.useState(false);
  const [text, setText] = React.useState('');
  const listRef = React.useRef<FlatList<any>>(null);
  const inputRef = React.useRef<TextInput>(null);
  const serverBacked = !String(postId).startsWith('offline-');

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
          if (mounted) setCommentsList(demoComments);
        }
      } catch {
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

  const demoReplies = [
    {
      id: 'reply-1',
      user: { id: 'u6', name: 'theunkownlegacy', avatarUrl: 'https://i.pravatar.cc/100?img=6' },
      text: `@${c.user?.name} new video on Paraboy 🧑‍🦰`,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(), // 4 weeks ago
      likes: 149,
      liked: false,
    },
  ];

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
      setReplies(prev => [newReply, ...prev]);
      setReplyText('');
      setShowReplyInput(false);
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

const styles = StyleSheet.create({
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  igSheet: { backgroundColor: gamerTheme.colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, height: '80%' },
  igHandle: { width: 40, height: 4, backgroundColor: gamerTheme.colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  igHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: gamerTheme.colors.border },
  sheetTitle: { color: gamerTheme.colors.textPrimary, fontWeight: 'bold', fontSize: 20 },
  igListWrap: { flex: 1, paddingTop: 12 },
  igInputRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: gamerTheme.colors.border },
  igInput: { flex: 1, color: gamerTheme.colors.textPrimary, maxHeight: 90, marginRight: 12, fontSize: 16, paddingVertical: 8 },
  postBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25 },
  commentRow: { flexDirection: 'row', gap: 12 },
  commentAvatar: { width: 40, height: 40, borderRadius: 20 },
  commentName: { color: gamerTheme.colors.textPrimary, fontWeight: 'bold' },
  commentTime: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  commentText: { color: gamerTheme.colors.textPrimary, marginTop: 4, lineHeight: 20 },
  commentActions: { flexDirection: 'row', gap: 20, alignItems: 'center', marginTop: 8 },
  commentLike: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  commentLikeText: { color: gamerTheme.colors.textSecondary, fontSize: 14, fontWeight: '600' },
  replyText: { color: gamerTheme.colors.textSecondary, fontWeight: 'bold', fontSize: 14 },
  repliesToggle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  repliesLine: { height: 1, width: 24, backgroundColor: gamerTheme.colors.border },
  repliesToggleText: { color: gamerTheme.colors.textSecondary, fontWeight: 'bold', fontSize: 14 },
  repliesContainer: { marginTop: 16, marginLeft: 24, borderLeftWidth: 2, borderLeftColor: gamerTheme.colors.border, paddingLeft: 16 },
  replyRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  replyAvatar: { width: 32, height: 32, borderRadius: 16 },
  replyName: { color: gamerTheme.colors.textPrimary, fontWeight: 'bold', fontSize: 14 },
  replyTime: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  replyActions: { flexDirection: 'row', gap: 16, alignItems: 'center', marginTop: 6 },
  replyLike: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  replyLikeText: { fontSize: 12, fontWeight: '600' },
  replyReplyText: { color: gamerTheme.colors.textSecondary, fontWeight: 'bold', fontSize: 12 },
  replyInputContainer: { marginTop: 12 },
  replyInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  replyInput: { flex: 1, color: gamerTheme.colors.textPrimary, fontSize: 14, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: gamerTheme.colors.surface, borderRadius: 16 },
  replyPostBtn: { padding: 6 },
  replyPostingText: { color: gamerTheme.colors.textSecondary },
  cancelReplyBtn: { alignSelf: 'flex-start', marginTop: 8 },
  cancelReplyText: { color: gamerTheme.colors.textSecondary, fontSize: 12, fontWeight: 'bold' },
});
