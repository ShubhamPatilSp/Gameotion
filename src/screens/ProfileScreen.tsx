import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { gamerTheme } from '@/styles/gamer_theme';
import { useAuth } from '@/store/auth';
import { Player, getUserProfile } from '@/api/users';
import { MainStackParamList } from '@/navigation/types';

const StatItem = ({ value, label }: { value: string | number; label: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const InfoCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoCard}>
    <Icon name={icon} size={24} color={gamerTheme.colors.textSecondary} />
    <View style={{ marginLeft: 12 }}>
      <Text style={styles.infoCardLabel}>{label}</Text>
      <Text style={styles.infoCardValue}>{value}</Text>
    </View>
  </View>
);

const GameStatCard = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.gameStatCard}>
    <Text style={styles.gameStatValue}>{value}</Text>
    <Text style={styles.gameStatLabel}>{label}</Text>
  </View>
);

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute() as { params?: MainStackParamList['Profile'] };
  const loggedInUser = useAuth((s) => s.user);
  const [activeTab, setActiveTab] = useState('Stats');

  const userIdToFetch = route.params?.userId || loggedInUser?.id;

  const { data: user, isLoading, error } = useQuery<Player, Error>({
    queryKey: ['user', userIdToFetch],
    queryFn: () => getUserProfile(userIdToFetch!),
    enabled: !!userIdToFetch,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={gamerTheme.colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>User not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={gamerTheme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{user.gamerTag || 'Profile'}</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Icon name="share-variant" size={24} color={gamerTheme.colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="cog" size={24} color={gamerTheme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfoContainer}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}` }} style={styles.avatar} />
            {user.isOnline && <View style={styles.onlineIndicator} />}
          </View>

          <Text style={styles.name}>{user.displayName || user.name}</Text>
          <View style={styles.gamerTagContainer}>
            <Text style={styles.gamerTag}>@{user.gamerTag || 'unknown'}</Text>
            {user.isVerified && <Icon name="check-decagram" size={16} color={gamerTheme.colors.primary} style={{ marginLeft: 4 }} />}
          </View>

          <View style={styles.tagsContainer}>
            {(user.gameTags || []).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.bio}>{user.bio || 'No bio available.'}</Text>
        </View>

        {/* User Stats */}
        <View style={styles.statsRow}>
          <StatItem value={(user.followers || 0).toLocaleString()} label="Followers" />
          <StatItem value={(user.following || 0).toLocaleString()} label="Following" />
          <StatItem value={user.level || 1} label="Level" />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Icon name="message-text-outline" size={20} color={gamerTheme.colors.textPrimary} />
            <Text style={styles.secondaryButtonText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Info Cards */}
        <View style={styles.infoCardsContainer}>
          <InfoCard icon="map-marker-outline" label="Location" value={user.location || 'Unknown'} />
          <InfoCard icon="calendar-month-outline" label="Joined" value={user.joined || 'Unknown'} />
        </View>

        {/* Content Tabs */}
        <View style={styles.tabsContainer}>
          {['Stats', 'Clips', 'Achievements', 'Matches'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && styles.activeTab]}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Game Stats Section */}
        {activeTab === 'Stats' && (
          <View style={styles.gameStatsSection}>
            <Text style={styles.sectionTitle}>Game Statistics</Text>
            <View style={styles.gameStatsGrid}>
              <GameStatCard value={user.stats?.winRate || 'N/A'} label="Win Rate" />
              <GameStatCard value={user.stats?.kdRatio || 'N/A'} label="K/D Ratio" />
              <GameStatCard value={user.stats?.hoursPlayed || 'N/A'} label="Hours Played" />
              <GameStatCard value={user.stats?.matches || 'N/A'} label="Matches" />
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles --- //
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, backgroundColor: '#101018', alignItems: 'center', justifyContent: 'center' },
  errorText: { color: gamerTheme.colors.error, fontSize: 16 },
  container: { flex: 1, backgroundColor: '#101018' },
  scrollContainer: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { color: gamerTheme.colors.textPrimary, fontSize: 18, fontWeight: 'bold' },
  profileInfoContainer: { alignItems: 'center', paddingHorizontal: 16, marginTop: 16 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: gamerTheme.colors.primary },
  onlineIndicator: { position: 'absolute', bottom: 5, right: 5, width: 15, height: 15, borderRadius: 7.5, backgroundColor: '#2ECC71', borderWidth: 2, borderColor: '#101018' },
  name: { color: gamerTheme.colors.textPrimary, fontSize: 24, fontWeight: 'bold', marginTop: 12 },
  gamerTagContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  gamerTag: { color: gamerTheme.colors.textSecondary, fontSize: 16 },
  tagsContainer: { flexDirection: 'row', marginTop: 12 },
  tag: { backgroundColor: 'rgba(138, 43, 226, 0.2)', borderColor: gamerTheme.colors.primary, borderWidth: 1, borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12, marginHorizontal: 4 },
  tagText: { color: gamerTheme.colors.primary, fontWeight: 'bold' },
  bio: { color: gamerTheme.colors.textSecondary, textAlign: 'center', marginTop: 12, marginHorizontal: 20, lineHeight: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingVertical: 20, borderBottomWidth: 1, borderTopWidth: 1, borderColor: gamerTheme.colors.surface, marginTop: 20 },
  statItem: { alignItems: 'center' },
  statValue: { color: gamerTheme.colors.textPrimary, fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: gamerTheme.colors.textSecondary, fontSize: 12, marginTop: 4 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 20, paddingHorizontal: 16 },
  primaryButton: { flex: 1, backgroundColor: gamerTheme.colors.primary, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { flex: 1, flexDirection: 'row', backgroundColor: gamerTheme.colors.surface, paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButtonText: { color: gamerTheme.colors.textPrimary, fontSize: 16, fontWeight: 'bold' },
  infoCardsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginTop: 20, paddingHorizontal: 16 },
  infoCard: { flex: 1, flexDirection: 'row', backgroundColor: gamerTheme.colors.surface, padding: 16, borderRadius: 12, alignItems: 'center' },
  infoCardLabel: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  infoCardValue: { color: gamerTheme.colors.textPrimary, fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: gamerTheme.colors.surface },
  tab: { paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: gamerTheme.colors.primary },
  tabText: { color: gamerTheme.colors.textSecondary, fontWeight: 'bold' },
  activeTabText: { color: gamerTheme.colors.primary },
  gameStatsSection: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { color: gamerTheme.colors.textPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  gameStatsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gameStatCard: { backgroundColor: gamerTheme.colors.surface, width: '48%', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  gameStatValue: { color: gamerTheme.colors.primary, fontSize: 28, fontWeight: 'bold' },
  gameStatLabel: { color: gamerTheme.colors.textSecondary, marginTop: 8 },
});
