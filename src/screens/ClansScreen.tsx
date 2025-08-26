import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listClans, listMyClans, joinClan, leaveClan, Clan, inviteToClan } from '@/api/clans';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gamerTheme } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ClansScreenNavigationProp } from '@/navigation/types';
import InvitesScreen from './InvitesScreen';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: gamerTheme.colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },
  title: { color: gamerTheme.colors.textPrimary, fontSize: 20, fontWeight: '900' },
  addBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: gamerTheme.colors.surface, borderWidth: 1, borderColor: gamerTheme.colors.border },
  chipsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: gamerTheme.colors.border },
  chipActive: { borderColor: gamerTheme.colors.accent, backgroundColor: '#0A1820' },
  chipText: { color: gamerTheme.colors.textSecondary, fontWeight: '800', fontSize: 12 },
  chipTextActive: { color: '#B6F5FF' },
  card: { marginHorizontal: 16, marginBottom: 12, borderRadius: 16, borderWidth: 1, borderColor: gamerTheme.colors.border, backgroundColor: gamerTheme.colors.surface, padding: 14 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: gamerTheme.colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0E0E16' },
  clanName: { color: gamerTheme.colors.textPrimary, fontWeight: '900' },
  clanTag: { color: gamerTheme.colors.accent, fontWeight: '900' },
  levelPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, backgroundColor: '#0F1A3A', borderWidth: 1, borderColor: gamerTheme.colors.primary },
  levelText: { color: '#D6DAFF', fontWeight: '800', fontSize: 12 },
  regionText: { color: gamerTheme.colors.textSecondary, fontSize: 12, marginLeft: 8 },
  desc: { color: gamerTheme.colors.textSecondary, marginTop: 8 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  statText: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  subtle: { color: gamerTheme.colors.textSecondary, fontSize: 12, marginTop: 10 },
  reqText: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  recruitingPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#0F2918', borderWidth: 1, borderColor: '#2ECC71' },
  recruitingText: { color: '#8EF3B0', fontWeight: '800', fontSize: 12 },
  applyBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: gamerTheme.colors.primary, borderWidth: 1, borderColor: gamerTheme.colors.border },
  applyText: { color: '#fff', fontWeight: '800' },
  applyBtnDisabled: { backgroundColor: gamerTheme.colors.surface, opacity: 0.7 },
  pill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, backgroundColor: '#0F1A3A', borderWidth: 1, borderColor: gamerTheme.colors.primary },
  pillText: { color: '#D6DAFF', fontSize: 12, fontWeight: '800' },
  errorText: { color: gamerTheme.colors.danger, textAlign: 'center', marginTop: 20 },
  leaveBtn: { backgroundColor: gamerTheme.colors.danger, borderColor: gamerTheme.colors.danger },
  leaveText: { color: '#fff' },
});

function Chip({ text, active = false, onPress }: { text: string; active?: boolean, onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{text}</Text>
    </TouchableOpacity>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}><Text style={styles.pillText}>{label}</Text></View>
  );
}

function ClanCard({ clan, onJoin, onLeave, onInvite, isJoining, isLeaving, isMember }: { clan: Clan, onJoin: () => void, onLeave: () => void, onInvite: () => void, isJoining: boolean, isLeaving: boolean, isMember?: boolean }) {
  const { name, tag, level, region, gameTags, description, membersCount, membersMax, founded, requirements, recruiting } = clan;
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.iconCircle}><Icon name="shield-outline" color={gamerTheme.colors.primary} size={20} /></View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.clanName}>{name}</Text>
            <Text style={styles.clanTag}>[{tag}]</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
            {gameTags.map((t) => (
              <Pill key={t} label={t} />
            ))}
          </View>
        </View>
        <View style={styles.levelPill}><Text style={styles.levelText}>LVL {level}</Text></View>
        <Text style={styles.regionText}>{region}</Text>
      </View>

      <Text style={styles.desc}>{description}</Text>

      <View style={styles.statRow}>
        <Text style={styles.statText}><Icon name="account-group-outline" size={14} color={gamerTheme.colors.textSecondary} /> {membersCount}/{membersMax} members</Text>
        <Text style={styles.statText}>Founded {founded}</Text>
      </View>

      <Text style={styles.subtle}>Requirements</Text>
      {requirements.map((r) => (
        <Text key={r} style={styles.reqText}>{r}</Text>
      ))}

      <View style={styles.footerRow}>
        {recruiting && (
          <View style={styles.recruitingPill}><Text style={styles.recruitingText}>RECRUITING</Text></View>
        )}
        {isMember ? (
          <>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.applyBtn, { backgroundColor: '#333' }]}
              onPress={onInvite}
            >
              <Text style={styles.applyText}>Send Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.applyBtn, styles.leaveBtn, isLeaving && styles.applyBtnDisabled]}
              onPress={onLeave}
              disabled={isLeaving}
            >
              <Text style={[styles.applyText, styles.leaveText]}>{isLeaving ? 'Leaving...' : 'Leave'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.applyBtn, isJoining && styles.applyBtnDisabled]}
            onPress={onJoin}
            disabled={isJoining}
          >
            <Text style={styles.applyText}>{isJoining ? 'Joining...' : 'Apply'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function ClansScreen() {
  const navigation = useNavigation() as ClansScreenNavigationProp;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState('Discover');

  const { data: discoverClans, isLoading: isLoadingDiscover, error: errorDiscover } = useQuery<Clan[], Error>({
    queryKey: ['clans', 'discover'],
    queryFn: listClans,
  });

  const { data: myClans, isLoading: isLoadingMy, error: errorMy } = useQuery<Clan[], Error>({
    queryKey: ['clans', 'my'],
    queryFn: listMyClans,
  });

  const leaveClanMutation = useMutation<{ clan: Clan }, Error, string>({
    mutationFn: leaveClan,
    onSuccess: () => {
      Alert.alert('Success', 'You have left the clan.');
      queryClient.invalidateQueries({ queryKey: ['clans', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['clans', 'discover'] });
    },
    onError: (err) => {
      Alert.alert('Error', err.message);
    },
  });

  const joinClanMutation = useMutation<Clan, Error, string>({
    mutationFn: joinClan,
    onSuccess: () => {
      Alert.alert('Success', 'Clan joined!');
      queryClient.invalidateQueries({ queryKey: ['clans', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['clans', 'discover'] });
    },
    onError: (err: Error) => {
      Alert.alert('Failed to join clan', err.message);
    },
  });

  const clansToDisplay = activeTab === 'Discover' ? discoverClans : myClans;
  const isLoading = activeTab === 'Discover' ? isLoadingDiscover : isLoadingMy;
  const error = activeTab === 'Discover' ? errorDiscover : errorMy;


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Clans</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('CreateClan')}><Icon name="plus" size={18} color={gamerTheme.colors.textPrimary} /></TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.chipsRow}>
        <Chip text="Discover" active={activeTab === 'Discover'} onPress={() => setActiveTab('Discover')} />
        <Chip text="My Clans" active={activeTab === 'My Clans'} onPress={() => setActiveTab('My Clans')} />
        <Chip text="Invites" active={activeTab === 'Invites'} onPress={() => setActiveTab('Invites')} />
      </View>

      {activeTab === 'Invites' ? (
        <InvitesScreen />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {isLoading && <ActivityIndicator color={gamerTheme.colors.primary} style={{ marginTop: 20 }} />}
          {error && <Text style={styles.errorText}>Failed to load clans: {error.message}</Text>}
          {clansToDisplay?.map((clan) => (
            <ClanCard
              key={clan.id}
              clan={clan}
              onJoin={() => joinClanMutation.mutate(clan.id)}
              onLeave={() => leaveClanMutation.mutate(clan.id)}
              isJoining={joinClanMutation.status === 'pending' && joinClanMutation.variables === clan.id}
              isLeaving={leaveClanMutation.status === 'pending' && leaveClanMutation.variables === clan.id}
              isMember={myClans?.some(c => c.id === clan.id)}
              onInvite={() => navigation.navigate('Search', { clanId: clan.id })}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
