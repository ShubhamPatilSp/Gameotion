import React from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { gamerTheme } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { listConversations, Conversation } from '@/api/chat';
import { formatDistanceToNow } from 'date-fns';

export default function ChatScreen() {
  const navigation = useNavigation();
  const { data: conversations, isLoading } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: listConversations,
  });
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
      
      {/* Conversation List */}
            {isLoading ? (
        <ActivityIndicator color={gamerTheme.colors.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatItem item={item} onPress={() => navigation.navigate('Conversation', { conversationId: item.id, title: item.title })} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}


function Tag({ label }: { label: string }) {
  return (
    <View style={styles.tag}><Text style={styles.tagText}>{label}</Text></View>
  );
}

function ChatItem({ item, onPress }: { item: Conversation; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.itemWrap} onPress={onPress}>
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
                            {item.isGroup && <Text style={styles.metaText}>{item.membersCount} members</Text>}
            </View>
                        <Text style={styles.metaText}>{formatDistanceToNow(new Date(item.time), { addSuffix: true })}</Text>
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
    </TouchableOpacity>
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


