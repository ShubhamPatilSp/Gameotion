import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gamerTheme } from '@/theme/theme';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function Button({ title, onPress, style }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.container, style]}>
      <LinearGradient
        colors={[gamerTheme.colors.primary, gamerTheme.colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: gamerTheme.radius.pill, overflow: 'hidden' },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: gamerTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#fff', fontWeight: '700' },
});


