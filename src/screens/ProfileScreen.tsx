import React from 'react';
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { gamerTheme } from '@/styles/gamer_theme';
import { useAuth } from '@/store/auth';
import { Player, getUserProfile } from '@/api/users';
import { MainStackParamList } from '@/navigation/types';

import ProfileHeader from '@/components/profile/ProfileHeader';
import UserInfo from '@/components/profile/UserInfo';
import UserStats from '@/components/profile/UserStats';
import ActionButtons from '@/components/profile/ActionButtons';
import InfoBoxes from '@/components/profile/InfoBoxes';
import StatsTabs from '@/components/profile/StatsTabs';

export default function ProfileScreen() {
  const route = useRoute() as { params?: MainStackParamList['Profile'] };
  const loggedInUser = useAuth((s) => s.user);

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

  const isFollowing = loggedInUser?.followingList?.includes(user.id) ?? false;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProfileHeader gamerTag={user.gamerTag} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <UserInfo user={user} />
        <UserStats followers={user.followers} following={user.following} level={user.level} />
        <ActionButtons profileUserId={user.id} isFollowing={isFollowing} profileUserGamerTag={user.gamerTag || user.name} />
        <InfoBoxes location={user.location} joined={user.joined} />
        <StatsTabs user={user} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles --- //
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: gamerTheme.colors.error, fontSize: 16 },
  container: { flex: 1 },
  scrollContainer: { paddingBottom: 40 },
});
