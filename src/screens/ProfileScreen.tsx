import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gamerTheme } from '@/theme/theme';
import { useProfile } from '@/store/profile';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const profile = useProfile((s) => s.profile);
  const name = profile.displayName ?? 'Alex Chen';
  const handle = '@ProGamer123';
  const avatar = profile.avatarUrl ?? 'https://i.pravatar.cc/150?img=65';
  const location = 'Mumbai, India';
  const joined = 'Jan 2024';
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Icon name="arrow-left" size={20} color={gamerTheme.colors.textPrimary} />
          <Text style={styles.topTitle}>ProGamer123</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Icon name="share-variant" size={18} color={gamerTheme.colors.textSecondary} />
          <Icon name="cog-outline" size={18} color={gamerTheme.colors.textSecondary} onPress={() => navigation.navigate('Settings')}
          />
        </View>
        </View>

        {/* Avatar + name */}
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.name}>{name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.handle}>{handle}</Text>
            <Icon name="check-decagram" size={16} color="#2ECC71" />
          </View>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
            <Pill label="Valorant" />
            <Pill label="Immortal I" highlight />
          </View>
          <Text style={styles.bioCenter}>Immortal Valorant player | Content creator | Looking for serious squad</Text>
        </View>

        {/* Counts */}
        <View style={styles.countsRow}>
          <CountBox value="2,847" label="Followers" />
          <CountBox value="156" label="Following" />
          <CountBox value="42" label="Level" />
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionPrimary]} activeOpacity={0.9}><Text style={styles.actionPrimaryText}>Follow</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionGhost]} activeOpacity={0.9}><Icon name="message-text-outline" size={16} color={gamerTheme.colors.textPrimary} /><Text style={styles.actionGhostText}>Message</Text></TouchableOpacity>
        </View>

        {/* Info cards */}
        <View style={styles.infoRow}>
          <InfoCard icon="map-marker-outline" title="Location" value={location} />
          <InfoCard icon="calendar-month-outline" title="Joined" value={joined} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TabChip text="Stats" active />
          <TabChip text="Clips" />
          <TabChip text="Achievements" />
          <TabChip text="Matches" />
        </View>

        {/* Game Statistics Card */}
        <Card title="Game Statistics">
          <View style={styles.grid2x2}>
            <MetricBox color="#30D158" value="73%" label="Win Rate" />
            <MetricBox color="#4DA3FF" value="1.85" label="K/D Ratio" />
            <MetricBox color="#D462FF" value="847h" label="Hours Played" />
            <MetricBox color="#D6DAFF" value="1,234" label="Matches" />
          </View>
        </Card>

        {/* Favorite agent */}
        <Card title="Favorite Agent">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: gamerTheme.colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0E0E16' }}><Icon name="gamepad-variant-outline" color={gamerTheme.colors.textPrimary} size={20} /></View>
            <View>
              <Text style={{ color: gamerTheme.colors.textPrimary, fontWeight: '900' }}>Jett</Text>
              <Text style={{ color: gamerTheme.colors.textSecondary }}>Most played character</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Pill({ label, highlight = false }: { label: string; highlight?: boolean }) {
  return (
    <View style={[styles.pill, highlight && styles.pillHighlight]}>
      <Text style={[styles.pillText, highlight && styles.pillTextHighlight]}>{label}</Text>
    </View>
  );
}

function CountBox({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.countBox}>
      <Text style={styles.countValue}>{value}</Text>
      <Text style={styles.countLabel}>{label}</Text>
    </View>
  );
}

function InfoCard({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <View style={styles.infoCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name={icon} size={16} color={gamerTheme.colors.textSecondary} />
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function TabChip({ text, active = false }: { text: string; active?: boolean }) {
  return (
    <View style={[styles.tabChip, active && styles.tabChipActive]}>
      <Text style={[styles.tabChipText, active && styles.tabChipTextActive]}>{text}</Text>
    </View>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function MetricBox({ color, value, label }: { color: string; value: string; label: string }) {
  return (
    <View style={styles.metricBox}>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: gamerTheme.colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 4, paddingBottom: 6 },
  topTitle: { color: gamerTheme.colors.textPrimary, fontWeight: '900' },
  hero: { alignItems: 'center', paddingTop: 8, paddingBottom: 12 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#0E0E16' },
  onlineDot: { position: 'absolute', right: 2, bottom: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#2ECC71', borderWidth: 2, borderColor: gamerTheme.colors.background },
  name: { color: gamerTheme.colors.textPrimary, fontSize: 20, fontWeight: '900', marginTop: 8 },
  handle: { color: gamerTheme.colors.accent, fontWeight: '900' },
  bioCenter: { color: gamerTheme.colors.textSecondary, textAlign: 'center', marginTop: 8, paddingHorizontal: 24 },

  countsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  countBox: { alignItems: 'center' },
  countValue: { color: gamerTheme.colors.textPrimary, fontWeight: '900' },
  countLabel: { color: gamerTheme.colors.textSecondary, fontSize: 12 },

  actionsRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', paddingHorizontal: 16, marginTop: 12 },
  actionBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  actionPrimary: { backgroundColor: gamerTheme.colors.primary, borderColor: gamerTheme.colors.border },
  actionPrimaryText: { color: '#fff', fontWeight: '900' },
  actionGhost: { flexDirection: 'row', gap: 8, backgroundColor: 'transparent', borderColor: gamerTheme.colors.border },
  actionGhostText: { color: gamerTheme.colors.textPrimary, fontWeight: '900' },

  infoRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 12 },
  infoCard: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: gamerTheme.colors.border, backgroundColor: gamerTheme.colors.surface, padding: 12 },
  infoTitle: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  infoValue: { color: gamerTheme.colors.textPrimary, fontWeight: '900' },

  tabsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, marginTop: 10 },
  tabChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: gamerTheme.colors.border },
  tabChipActive: { borderColor: gamerTheme.colors.accent, backgroundColor: '#0A1820' },
  tabChipText: { color: gamerTheme.colors.textSecondary, fontWeight: '800', fontSize: 12 },
  tabChipTextActive: { color: '#B6F5FF' },

  card: { marginHorizontal: 12, marginTop: 12, borderRadius: 16, borderWidth: 1, borderColor: gamerTheme.colors.border, backgroundColor: gamerTheme.colors.surface, padding: 12 },
  cardTitle: { color: gamerTheme.colors.textPrimary, fontWeight: '900', marginBottom: 10 },
  grid2x2: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metricBox: { width: '48%', borderRadius: 12, borderWidth: 1, borderColor: gamerTheme.colors.border, backgroundColor: '#0E0E16', paddingVertical: 16, alignItems: 'center' },
  metricValue: { fontWeight: '900', fontSize: 22 },
  metricLabel: { color: gamerTheme.colors.textSecondary },

  pill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, backgroundColor: '#0F1A3A', borderWidth: 1, borderColor: gamerTheme.colors.primary },
  pillHighlight: { backgroundColor: '#1D0F2A', borderColor: '#FF33B0' },
  pillText: { color: '#D6DAFF', fontSize: 12, fontWeight: '800' },
  pillTextHighlight: { color: '#FFB6E9' },
});


