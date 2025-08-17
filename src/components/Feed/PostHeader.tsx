import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { gamerTheme } from '@/theme/theme';

export default function PostHeader({ name, avatar, gameTag, createdAt, live, onOptions }: { name: string; avatar: string; gameTag?: string; createdAt?: string; live?: boolean; onOptions?: () => void }) {
  const prettyTag = gameTag
    ? gameTag
        .split('_')
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ')
    : undefined;
  return (
    <View style={styles.row}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Icon name="check-decagram" color="#2ECC71" size={16} />
        </View>
        <View style={styles.subRow}>
          {live ? (
            <View style={styles.livePill}><Text style={styles.liveText}>LIVE</Text></View>
          ) : null}
          {prettyTag ? (
            <View style={styles.pill}><Text style={styles.pillText}>{prettyTag}</Text></View>
          ) : null}
          {createdAt ? <Text style={styles.dot}> • </Text> : null}
          {createdAt ? <Text style={styles.timeText}>{formatTime(createdAt)}</Text> : null}
        </View>
      </View>
      <TouchableOpacity onPress={onOptions} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Icon name="dots-horizontal" size={22} color={gamerTheme.colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { color: gamerTheme.colors.textPrimary, fontWeight: '800', fontSize: 16, letterSpacing: 0.2, flexShrink: 1 },
  subRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  pill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, backgroundColor: '#0F1A3A', borderWidth: 1, borderColor: gamerTheme.colors.primary },
  pillText: { color: '#D6DAFF', fontSize: 12, fontWeight: '800' },
  livePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: '#2A0F2E', borderWidth: 1, borderColor: '#FF33B0' },
  liveText: { color: '#FF9AD4', fontSize: 12, fontWeight: '900' },
  dot: { color: gamerTheme.colors.textSecondary },
  timeText: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
});

function formatTime(iso?: string) {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diffMs / (1000 * 60 * 60));
  if (h <= 0) return 'now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}


