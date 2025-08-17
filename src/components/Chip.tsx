import React from 'react';
import { Text, StyleSheet, ViewStyle, Pressable, View } from 'react-native';
import { gamerTheme } from '@/theme/theme';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function Chip({ label, active, onPress, style }: Props) {
  return (
    <View style={{ borderRadius: 20 }}>
      <Pressable
        android_ripple={{ color: '#1F1F2A', borderless: false }}
        onPress={onPress}
        style={({ pressed }) => [
          styles.chip,
          active ? styles.active : undefined,
          pressed ? styles.pressed : undefined,
          style,
        ]}
      >
        <Text style={[styles.text, active ? styles.textActive : undefined]} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: gamerTheme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 32,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  active: {
    backgroundColor: gamerTheme.colors.surface,
    borderColor: gamerTheme.colors.primary,
  },
  text: { color: gamerTheme.colors.textSecondary, fontWeight: '600' },
  textActive: { color: gamerTheme.colors.textPrimary },
  pressed: { opacity: 0.9 },
});


