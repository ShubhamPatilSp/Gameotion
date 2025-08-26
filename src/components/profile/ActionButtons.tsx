import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { gamerTheme } from '@/styles/gamer_theme';
import { followUser, unfollowUser } from '@/api/users';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/store/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';


interface ActionButtonsProps {
  profileUserId: string;
  profileUserGamerTag: string;
  isFollowing: boolean;
}

export default function ActionButtons({ profileUserId, profileUserGamerTag, isFollowing: initialIsFollowing }: ActionButtonsProps) {
  const navigation: NativeStackNavigationProp<MainStackParamList> = useNavigation();
  const { user, setUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollowToggle = async () => {
    if (isLoading || !user || user.id === profileUserId) return;

    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(profileUserId);
        setIsFollowing(false);
        const updatedUser = { ...user, followingList: user.followingList?.filter(id => id !== profileUserId) };
        setUser(updatedUser);
      } else {
        await followUser(profileUserId);
        setIsFollowing(true);
        const updatedUser = { ...user, followingList: [...(user.followingList || []), profileUserId] };
        setUser(updatedUser);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to ${isFollowing ? 'unfollow' : 'follow'} user.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessage = () => {
    if (!user) return;
    // A more sophisticated implementation would first check for an existing
    // conversation or create a new one, then navigate.
    // For now, we'll generate a predictable conversation ID based on user IDs.
    const sortedIds = [user.id, profileUserId].sort();
    const conversationId = sortedIds.join('_');
    navigation.navigate('Conversation', { 
      conversationId,
      title: profileUserGamerTag
    });
  };

  if (!user || user.id === profileUserId) {
    // Don't show buttons on the user's own profile
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.followButton, isFollowing && styles.followingButton]}
        onPress={handleFollowToggle}
        disabled={isLoading}
      >
        <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
        <Icon name="message-text-outline" size={20} color={gamerTheme.colors.primary} />
        <Text style={styles.secondaryButtonText}>Message</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  followButton: {
    flex: 1,
    backgroundColor: gamerTheme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  followingButton: {
    backgroundColor: gamerTheme.colors.surface,
    borderWidth: 1,
    borderColor: gamerTheme.colors.primary,
  },
  followButtonText: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: gamerTheme.colors.primary,
  },
  messageButton: {
    backgroundColor: gamerTheme.colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gamerTheme.colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
