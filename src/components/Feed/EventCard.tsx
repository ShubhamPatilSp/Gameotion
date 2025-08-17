import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { gamerTheme } from '@/theme/theme';

type Props = {
  title: string;
  gameTag: string;
  startsAt: string;
  city?: string;
  cta?: string;
};

export default function EventCard({ title, gameTag, startsAt, city, cta = 'Join' }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.game}>{gameTag.toUpperCase()}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>{new Date(startsAt).toLocaleString()} {city ? `• ${city}` : ''}</Text>
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>{cta}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: gamerTheme.colors.surface,
    borderRadius: gamerTheme.radius.lg,
    padding: gamerTheme.spacing(2),
    marginBottom: gamerTheme.spacing(2),
    borderWidth: 1,
    borderColor: gamerTheme.colors.border,
  },
  game: { color: gamerTheme.colors.accent, fontWeight: '700', marginBottom: 6, textTransform: 'capitalize' },
  title: { color: gamerTheme.colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  meta: { color: gamerTheme.colors.textSecondary, marginBottom: 10 },
  btn: { alignSelf: 'flex-start', backgroundColor: gamerTheme.colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  btnText: { color: '#fff', fontWeight: '700' },
});


