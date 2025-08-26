import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gamerTheme } from '@/theme/theme';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
};

export default function Button({ title, onPress, style, variant = 'primary', loading = false }: Props) {
  if (variant === 'secondary') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.container, style]}>
        <View style={styles.secondaryButton}>
          {loading ? <ActivityIndicator color={gamerTheme.colors.textPrimary} /> : <Text style={styles.secondaryText}>{title}</Text>}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.container, style]}>
      <LinearGradient
        colors={[gamerTheme.colors.primary, gamerTheme.colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: gamerTheme.radius.pill, overflow: 'hidden', marginVertical: 8 },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: gamerTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: gamerTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gamerTheme.colors.surface,
  },
  secondaryText: {
    color: gamerTheme.colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
});


