import React from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { gamerTheme } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Conversation = {
  id: string;
  title: string;
  isGroup?: boolean;
  members?: number;
  gameTag?: string;
  extraTag?: string;
  snippet: string;
  time: string; // e.g., '2m ago'
  unread?: number;
};

const DATA: Conversation[] = [
  { id: 'c1', title: 'ProGamer123', gameTag: 'Valorant', extraTag: 'Diamond II', snippet: "Ready for ranked? Let's push to Immortal!", time: '2m ago', unread: 2 },
  { id: 'c2', title: 'Diamond Demons', isGroup: true, members: 5, gameTag: 'BGMI', snippet: 'GG everyone! Same time tomorrow?', time: '15m ago' },
  { id: 'c3', title: 'Summer Championship', isGroup: true, members: 64, gameTag: 'COD Mobile', snippet: 'Bracket updated - check your next match', time: '1h ago', unread: 1 },
  { id: 'c4', title: 'Neon Warriors', isGroup: true, members: 127, gameTag: 'Multiple', snippet: 'Welcome new members! Check the events channel', time: '3h ago' },
  { id: 'c5', title: 'SkillShot', gameTag: 'Apex Legends', snippet: 'That clutch was insane!', time: '1d ago' },
];

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Messages</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Icon name="plus" size={18} color={gamerTheme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Icon name="magnify" size={20} color={gamerTheme.colors.textSecondary} />
        <TextInput style={styles.input} placeholder="Search messages..." placeholderTextColor={gamerTheme.colors.textSecondary} />
      </View>

      {/* Filters */}
      <View style={styles.chipsRow}>
        <FilterChip text="All" active />
        <FilterChip text="Squads" />
        <FilterChip text="Tournaments" />
        <FilterChip text="Clans" />
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <ActionCard icon="account-group-outline" title="Create Squad" />
        <ActionCard icon="gamepad-variant-outline" title="Find Match" highlighted />
      </View>

      {/* Conversation List */}
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatItem item={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

function FilterChip({ text, active = false }: { text: string; active?: boolean }) {
  return (
    <View style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{text}</Text>
    </View>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <View style={styles.tag}><Text style={styles.tagText}>{label}</Text></View>
  );
}

function ChatItem({ item }: { item: Conversation }) {
  return (
    <View style={styles.itemWrap}>
      <View style={styles.itemRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.title.charAt(0)}</Text>
          {item.isGroup ? (
            <Icon name="account-group" size={14} color={gamerTheme.colors.textSecondary} style={styles.avatarBadgeLeft} />
          ) : (
            <View style={styles.onlineDot} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.itemHeaderRowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.isGroup && <Text style={styles.metaText}>{item.members} members</Text>}
            </View>
            <Text style={styles.metaText}>{item.time}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            {item.gameTag && <Tag label={item.gameTag} />}
            {item.extraTag && <Tag label={item.extraTag} />}
          </View>
          <Text style={styles.snippet} numberOfLines={1}>{item.snippet}</Text>
        </View>
        {!!item.unread && (
          <View style={styles.unread}><Text style={styles.unreadText}>{item.unread}</Text></View>
        )}
      </View>
    </View>
  );
}

function ActionCard({ icon, title, highlighted }: { icon: string; title: string; highlighted?: boolean }) {
  if (highlighted) {
    return (
      <LinearGradient colors={[gamerTheme.colors.primary, '#FF33B0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, borderRadius: 14, padding: 1 }}>
        <View style={[styles.actionCard, { borderWidth: 0 }]}>
          <Icon name={icon} size={22} color={gamerTheme.colors.textPrimary} />
          <Text style={styles.actionTitle}>{title}</Text>
        </View>
      </LinearGradient>
    );
  }
  return (
    <View style={styles.actionCard}>
      <Icon name={icon} size={22} color={gamerTheme.colors.textPrimary} />
      <Text style={styles.actionTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: gamerTheme.colors.background, paddingHorizontal: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, paddingBottom: 8 },
  screenTitle: { color: gamerTheme.colors.textPrimary, fontSize: 20, fontWeight: '900' },
  addBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: gamerTheme.colors.surface, borderWidth: 1, borderColor: gamerTheme.colors.border },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0E0E16', borderWidth: 1, borderColor: gamerTheme.colors.border, borderRadius: 12, paddingHorizontal: 10, height: 44, marginBottom: 10 },
  input: { color: gamerTheme.colors.textPrimary, marginLeft: 8, flex: 1 },
  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: gamerTheme.colors.border },
  chipActive: { borderColor: gamerTheme.colors.accent, backgroundColor: '#0A1820' },
  chipText: { color: gamerTheme.colors.textSecondary, fontWeight: '800', fontSize: 12 },
  chipTextActive: { color: '#B6F5FF' },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  actionCard: { flex: 1, borderRadius: 14, borderWidth: 1, borderColor: gamerTheme.colors.border, backgroundColor: gamerTheme.colors.surface, paddingVertical: 16, alignItems: 'center', gap: 6 },
  actionTitle: { color: gamerTheme.colors.textPrimary, fontWeight: '800' },
  itemWrap: { borderRadius: 16, borderWidth: 1, borderColor: gamerTheme.colors.border, backgroundColor: gamerTheme.colors.surface, padding: 12, marginBottom: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#0E0E16', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: gamerTheme.colors.border, position: 'relative' },
  avatarText: { color: gamerTheme.colors.textPrimary, fontWeight: '900' },
  itemHeaderRowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemTitle: { color: gamerTheme.colors.textPrimary, fontWeight: '800' },
  metaText: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: '#0F1A3A', borderWidth: 1, borderColor: gamerTheme.colors.primary },
  tagText: { color: '#D6DAFF', fontSize: 12, fontWeight: '800' },
  snippet: { color: gamerTheme.colors.textSecondary },
  unread: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: '#FF33B0', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  unreadText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  onlineDot: { position: 'absolute', right: -2, bottom: -2, width: 10, height: 10, borderRadius: 5, backgroundColor: '#2ECC71', borderWidth: 2, borderColor: gamerTheme.colors.surface },
  avatarBadgeLeft: { position: 'absolute', left: -4, bottom: -2 },
});


