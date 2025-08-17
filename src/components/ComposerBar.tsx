import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { gamerTheme } from '@/theme/theme';

export default function ComposerBar({ onCompose }: { onCompose: () => void }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onCompose} style={styles.btn}>
        <Icon name="pencil" size={22} color={gamerTheme.colors.textSecondary} />
        <Text style={styles.text}>Share something…</Text>
      </TouchableOpacity>
      {/* quick actions removed per design */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: gamerTheme.colors.surface,
    borderTopWidth: 1,
    borderColor: gamerTheme.colors.border,
    padding: 12,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0E0E16',
    borderWidth: 1,
    borderColor: gamerTheme.colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  text: { color: gamerTheme.colors.textSecondary },
});


