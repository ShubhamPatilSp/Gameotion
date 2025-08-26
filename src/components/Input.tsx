import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { gamerTheme } from '@/theme/theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
};

export default function Input({ label, value, onChangeText, placeholder, secureTextEntry, error }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={gamerTheme.colors.textSecondary}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    color: gamerTheme.colors.textPrimary,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: gamerTheme.colors.surface,
    borderRadius: gamerTheme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: gamerTheme.colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: gamerTheme.colors.border,
  },
  inputError: {
    borderColor: gamerTheme.colors.danger,
  },
  errorText: {
    color: gamerTheme.colors.danger,
    marginTop: 4,
    fontSize: 12,
  },
});
