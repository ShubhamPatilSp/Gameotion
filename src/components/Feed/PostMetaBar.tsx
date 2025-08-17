import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useSharedValue, withSpring, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { gamerTheme } from '@/theme/theme';

type Props = { likes: number; comments: number; shares?: number; bookmarked?: boolean; liked?: boolean; onLike?: () => void; onComment?: () => void; onShare?: () => void; onSave?: () => void };

export default function PostMetaBar({ likes, comments, shares = 0, bookmarked, liked, onLike, onComment, onShare, onSave }: Props) {
  const scale = useSharedValue(1);
  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const handleLikePress = () => {
    scale.value = 0.8;
    scale.value = withSpring(1, { damping: 6, stiffness: 140 });
    onLike && onLike();
  };
  return (
    <View style={styles.row}>
      <View style={styles.item}>
        <Animated.View style={heartStyle}>
          <Icon
            name={liked ? 'heart' : 'heart-outline'}
            size={18}
            color={liked ? '#FF33B0' : gamerTheme.colors.textSecondary}
            onPress={handleLikePress}
          />
        </Animated.View>
        <Text style={[styles.text, liked && { color: '#FF33B0', fontWeight: '800' }]}>{formatNum(likes)}</Text>
      </View>
      <View style={styles.item}>
        <Icon name="comment-outline" size={18} color={gamerTheme.colors.textSecondary} onPress={onComment} />
        <Text style={styles.text}>{formatNum(comments)}</Text>
      </View>
      <View style={styles.item}>
        <Icon name="share-outline" size={18} color={gamerTheme.colors.textSecondary} onPress={onShare} />
        <Text style={styles.text}>{formatNum(shares)}</Text>
      </View>
      <View style={[styles.item, { marginLeft: 'auto' }]}>
        <Icon name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={18} color={bookmarked ? gamerTheme.colors.primary : gamerTheme.colors.textSecondary} onPress={onSave} />
      </View>
    </View>
  );
}

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16, alignItems: 'center', paddingTop: 8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  text: { color: gamerTheme.colors.textSecondary },
});


