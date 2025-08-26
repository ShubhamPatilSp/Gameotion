import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { gamerTheme } from '@/styles/gamer_theme';

const StatItem = ({ value, label }: { value: string | number; label: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface UserStatsProps {
  followers?: number;
  following?: number;
  level?: number;
}

export default function UserStats({ followers, following, level }: UserStatsProps) {
  return (
    <View style={styles.statsRow}>
      <StatItem value={(followers || 0).toLocaleString()} label="Followers" />
      <StatItem value={(following || 0).toLocaleString()} label="Following" />
      <StatItem value={level || 1} label="Level" />
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: gamerTheme.colors.surface,
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: gamerTheme.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});
