import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gamerTheme } from '@/theme/theme';

export type StoryItem = { type: 'image'; url: string; durationMs?: number };
export type StoryUser = { id: string; name: string; live?: boolean; avatar: string; items: StoryItem[] };

export const DEMO_STORIES: StoryUser[] = [
  {
    id: 's1',
    name: 'ProGamer',
    live: true,
    avatar: 'https://i.pravatar.cc/100?img=11',
    items: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop', durationMs: 4000 },
      { type: 'image', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop', durationMs: 4000 },
    ],
  },
  {
    id: 's2',
    name: 'SkillShot',
    avatar: 'https://i.pravatar.cc/100?img=22',
    items: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1598557182701-0a3db1c8cce5?q=80&w=1200&auto=format&fit=crop', durationMs: 4500 },
    ],
  },
  {
    id: 's3',
    name: 'NinjaPlayer',
    live: true,
    avatar: 'https://i.pravatar.cc/100?img=33',
    items: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1612198180025-1c9e1f50b1d0?q=80&w=1200&auto=format&fit=crop', durationMs: 4000 },
      { type: 'image', url: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop', durationMs: 4000 },
    ],
  },
  {
    id: 's4',
    name: 'GameMaster',
    avatar: 'https://i.pravatar.cc/100?img=44',
    items: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1542751438-5bf77f16f0d4?q=80&w=1200&auto=format&fit=crop', durationMs: 4500 },
    ],
  },
  {
    id: 's5',
    name: 'SniperX',
    avatar: 'https://i.pravatar.cc/100?img=55',
    items: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop', durationMs: 4500 },
    ],
  },
];

export default function StoriesStrip({ onOpen }: { onOpen?: (idx: number) => void }) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <TouchableOpacity style={styles.yourStory}>
          <View style={styles.plusCircle}><Text style={{ color: '#fff', fontWeight: '900' }}>+</Text></View>
          <Text style={styles.caption}>Your Story</Text>
        </TouchableOpacity>
        {DEMO_STORIES.map((u, idx) => (
          <TouchableOpacity key={u.id} style={[styles.item, idx === 1 && styles.itemActive]} activeOpacity={0.8} onPress={() => onOpen && onOpen(idx)}> 
            <LinearGradient colors={[u.live ? '#FF4D67' : '#3A3A4A', '#1B1B2A']} style={styles.ring}>
              <Image source={{ uri: u.avatar }} style={styles.avatar} />
            </LinearGradient>
            {u.live && <View style={styles.livePill}><Text style={styles.liveText}>LIVE</Text></View>}
            <Text numberOfLines={1} style={styles.caption}>{u.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 8, borderBottomWidth: 1, borderColor: gamerTheme.colors.border },
  row: { paddingHorizontal: 12, gap: 14, alignItems: 'center' },
  yourStory: { width: 72, alignItems: 'center' },
  plusCircle: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#3A3A4A', alignItems: 'center', justifyContent: 'center', backgroundColor: gamerTheme.colors.surface },
  item: { width: 72, alignItems: 'center' },
  itemActive: { borderBottomWidth: 2, borderColor: gamerTheme.colors.primary, paddingBottom: 6 },
  ring: { padding: 2, borderRadius: 30 },
  avatar: { width: 52, height: 52, borderRadius: 26, marginBottom: 6, backgroundColor: '#0E0E16' },
  livePill: { position: 'absolute', top: 36, backgroundColor: '#FF4D67', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  liveText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  caption: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
});


