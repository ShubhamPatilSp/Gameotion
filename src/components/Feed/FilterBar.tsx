import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Chip from '@/components/Chip';
import { gamerTheme } from '@/theme/theme';

type Props = {
  active: { scope: 'all' | 'friends' | 'nearby' | 'tournaments' | 'clips'; game?: string };
  onChange: (next: Props['active']) => void;
};

export default function FilterBar({ active, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Chip label="Following" active={active.scope === 'friends'} onPress={() => onChange({ scope: 'friends', game: undefined })} />
      <Chip label="For You" active={active.scope === 'all'} onPress={() => onChange({ scope: 'all', game: undefined })} />
      <Chip label="Tournaments" active={active.scope === 'tournaments'} onPress={() => onChange({ scope: 'tournaments', game: undefined })} />
      <Chip label="Clips" active={active.scope === 'clips'} onPress={() => onChange({ scope: 'clips', game: undefined })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 12, gap: 8, paddingBottom: 8 },
});


