import React from 'react';
import { View, StyleSheet } from 'react-native';
import { gamerTheme } from '@/theme/theme';

export default function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i < step ? styles.dotActive : undefined]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginVertical: 16, alignSelf: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: gamerTheme.colors.border },
  dotActive: { backgroundColor: gamerTheme.colors.primary },
});


