import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { gamerTheme } from '@/styles/gamer_theme';

interface ProfileHeaderProps {
  gamerTag?: string;
}

export default function ProfileHeader({ gamerTag }: ProfileHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={gamerTheme.colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <View style={styles.centerContainer}>
        <Text style={styles.headerTitle}>{gamerTag || 'Profile'}</Text>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity style={{ marginRight: 16 }}>
          <Icon name="share-variant" size={24} color={gamerTheme.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="cog" size={24} color={gamerTheme.colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  leftContainer: {
    width: '20%',
    alignItems: 'flex-start',
  },
  centerContainer: {
    width: '60%',
    alignItems: 'center',
  },
  rightContainer: {
    width: '20%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
