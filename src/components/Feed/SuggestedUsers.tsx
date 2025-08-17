import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { gamerTheme } from '@/theme/theme';

type SuggestedUser = {
  id: string;
  name: string;
  handle: string;
  city?: string;
  avatarUrl: string;
  tag?: string;
};

const DEMO_USERS: SuggestedUser[] = [
  { id: 'su1', name: 'ProGamer123', handle: '@ProGamer123', city: 'Mumbai', avatarUrl: 'https://i.pravatar.cc/100?img=11', tag: 'Valorant' },
  { id: 'su2', name: 'SkillShot', handle: '@SkillShot', city: 'Delhi', avatarUrl: 'https://i.pravatar.cc/100?img=22', tag: 'Apex' },
  { id: 'su3', name: 'NinjaPlayer', handle: '@NinjaPlayer', city: 'Bangalore', avatarUrl: 'https://i.pravatar.cc/100?img=33', tag: 'CS2' },
  { id: 'su4', name: 'GameMaster', handle: '@GameMaster', city: 'Chennai', avatarUrl: 'https://i.pravatar.cc/100?img=44', tag: 'BGMI' },
  { id: 'su5', name: 'ShadowFox', handle: '@ShadowFox', city: 'Pune', avatarUrl: 'https://i.pravatar.cc/100?img=15', tag: 'CODM' },
];

export default function SuggestedUsers() {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Suggested Players</Text>
        <Text style={styles.count}>{DEMO_USERS.length}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {DEMO_USERS.map((u) => (
          <View key={u.id} style={styles.card}>
            <Image source={{ uri: u.avatarUrl }} style={styles.avatar} />
            <Text numberOfLines={1} style={styles.name}>{u.name}</Text>
            <Text numberOfLines={1} style={styles.handle}>{u.handle}</Text>
            {u.tag ? <View style={styles.tag}><Text style={styles.tagText}>{u.tag}</Text></View> : null}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TouchableOpacity activeOpacity={0.9} style={styles.btn} onPress={() => navigation.navigate('UserFeed', { userId: u.id, title: u.name })}>
                <Text style={styles.btnText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.9} style={[styles.btn, { backgroundColor: '#1D1D28' }]}> 
                <Text style={[styles.btnText, { color: gamerTheme.colors.textSecondary }]}>Follow</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, marginBottom: 8 },
  title: { color: gamerTheme.colors.textPrimary, fontWeight: '900' },
  count: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  row: { gap: 10 },
  card: { width: 140, borderRadius: 14, borderWidth: 1, borderColor: gamerTheme.colors.border, backgroundColor: gamerTheme.colors.surface, padding: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0E0E16', marginBottom: 8 },
  name: { color: gamerTheme.colors.textPrimary, fontWeight: '800' },
  handle: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: '#0F1A3A', borderWidth: 1, borderColor: gamerTheme.colors.primary, marginTop: 6 },
  tagText: { color: '#D6DAFF', fontSize: 12, fontWeight: '800' },
  btn: { alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: gamerTheme.colors.primary, borderWidth: 1, borderColor: gamerTheme.colors.border },
  btnText: { color: '#fff', fontWeight: '800' },
});


