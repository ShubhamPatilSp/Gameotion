import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { gamerTheme } from '@/styles/gamer_theme';
import { Player } from '@/api/users';

const GameStatCard = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.gameStatCard}>
    <Text style={styles.gameStatValue}>{value}</Text>
    <Text style={styles.gameStatLabel}>{label}</Text>
  </View>
);

interface StatsTabsProps {
  user: Player;
}

export default function StatsTabs({ user }: StatsTabsProps) {
  const [activeTab, setActiveTab] = useState('Stats');

  return (
    <View>
      <View style={styles.tabsContainer}>
        {['Stats', 'Clips', 'Achievements', 'Matches'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
      {/* Placeholder for other tabs */}
      {activeTab !== 'Stats' && (
        <View style={styles.contentPlaceholder}>
          <Text style={styles.placeholderText}>Content for {activeTab}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: gamerTheme.colors.surface,
  },
  tab: {
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: gamerTheme.colors.primary,
  },
  tabText: {
    color: gamerTheme.colors.textSecondary,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: gamerTheme.colors.primary,
  },
  gameStatsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  gameStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameStatCard: {
    backgroundColor: gamerTheme.colors.surface,
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  gameStatValue: {
    color: gamerTheme.colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  gameStatLabel: {
    color: gamerTheme.colors.textSecondary,
    marginTop: 8,
  },
  contentPlaceholder: {
    padding: 40,
    alignItems: 'center',
  },
  placeholderText: {
    color: gamerTheme.colors.textSecondary,
    fontSize: 16,
  },
});
