import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { gamerTheme } from '@/styles/gamer_theme';
import { Player } from '@/api/users';

interface UserInfoProps {
  user: Player;
}

export default function UserInfo({ user }: UserInfoProps) {
  return (
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
  );
}

const styles = StyleSheet.create({
  profileInfoContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: gamerTheme.colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#2ECC71',
    borderWidth: 2,
    borderColor: '#101018',
  },
  name: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  gamerTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  gamerTag: {
    color: gamerTheme.colors.textSecondary,
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  tag: {
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    borderColor: gamerTheme.colors.primary,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  tagText: {
    color: gamerTheme.colors.primary,
    fontWeight: 'bold',
  },
  bio: {
    color: gamerTheme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    marginHorizontal: 20,
    lineHeight: 20,
  },
});
