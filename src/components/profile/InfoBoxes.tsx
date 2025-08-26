import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { gamerTheme } from '@/styles/gamer_theme';

const InfoCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoCard}>
    <Icon name={icon} size={24} color={gamerTheme.colors.textSecondary} />
    <View style={{ marginLeft: 12 }}>
      <Text style={styles.infoCardLabel}>{label}</Text>
      <Text style={styles.infoCardValue}>{value}</Text>
    </View>
  </View>
);

interface InfoBoxesProps {
  location?: string;
  joined?: string;
}

export default function InfoBoxes({ location, joined }: InfoBoxesProps) {
  return (
    <View style={styles.infoCardsContainer}>
      <InfoCard icon="map-marker-outline" label="Location" value={location || 'Unknown'} />
      <InfoCard icon="calendar-month-outline" label="Joined" value={joined || 'Unknown'} />
    </View>
  );
}

const styles = StyleSheet.create({
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: gamerTheme.colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoCardLabel: {
    color: gamerTheme.colors.textSecondary,
    fontSize: 12,
  },
  infoCardValue: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
