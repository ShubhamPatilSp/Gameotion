import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

import { useAuth } from '@/store/auth';
import { gamerTheme } from '@/styles/gamer_theme';
import { Player, getUserProfile } from '@/api/users';
import { inviteToClan } from '@/api/clans';
import { MainStackParamList } from '@/navigation/types';

export default function ProfileScreen() {
  const route = useRoute() as { params?: MainStackParamList['Profile'] };
  const loggedInUser = useAuth((s) => s.user);

  const { clanId } = route.params || {};

  // Use the userId from route params, or fall back to the logged-in user's ID.
  // The route.params could be undefined when coming from the Tab navigator.
  const userIdToFetch = route.params?.userId || loggedInUser?.id;

  const { data: user, isLoading, error } = useQuery<Player, Error>({
    queryKey: ['user', userIdToFetch],
    queryFn: () => getUserProfile(userIdToFetch!),
    enabled: !!userIdToFetch, // Only run the query if we have a userId to fetch
  });

  const sendInviteMutation = useMutation({
    mutationFn: ({ clanId, userId }: { clanId: string; userId: string }) => inviteToClan(clanId, userId),
    onSuccess: () => Alert.alert('Success', 'Invitation sent!'),
    onError: (err: Error) => Alert.alert('Error', `Failed to send invite: ${err.message}`),
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={gamerTheme.colors.primary} style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>User not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: user.avatarUrl || 'https://i.pravatar.cc/150?u=' + user.id }} style={styles.avatar} />
        <Text style={styles.userName}>{user.name}</Text>
        {user.gamerTag && <Text style={styles.gamerTag}>@{user.gamerTag}</Text>}

        {user.city && (
          <View style={styles.locationContainer}>
            <Icon name="map-marker-outline" size={16} color={gamerTheme.colors.textSecondary} />
            <Text style={styles.locationText}>{user.city}</Text>
          </View>
        )}

        {user.id !== loggedInUser?.id && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{user.friends ? 'Friends' : 'Add Friend'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Message</Text>
            </TouchableOpacity>
          </View>
        )}

        {clanId && user.id !== loggedInUser?.id && (
          <TouchableOpacity 
            style={styles.inviteButton}
            onPress={() => sendInviteMutation.mutate({ clanId, userId: user.id })}
            disabled={sendInviteMutation.isPending}
          >
            <Text style={styles.inviteButtonText}>
              {sendInviteMutation.isPending ? 'Sending...' : 'Invite to Clan'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gamerTheme.colors.background,
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  userName: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    color: gamerTheme.colors.textSecondary,
    fontSize: 16,
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: gamerTheme.colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gamerTheme.colors.border,
  },
  actionButtonText: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: gamerTheme.colors.primary,
    borderColor: gamerTheme.colors.primary,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  inviteButton: {
    marginTop: 20,
    backgroundColor: gamerTheme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gamerTag: {
    color: gamerTheme.colors.textSecondary,
    fontSize: 18,
    marginBottom: 20,
  },
  errorText: {
    color: gamerTheme.colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
});
