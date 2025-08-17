import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image } from 'react-native';
import Button from '@/components/Button';
import { gamerTheme } from '@/theme/theme';
import ProgressDots from '@/components/ProgressDots';
import { useProfile } from '@/store/profile';

export default function ProfileSetupScreen({ navigation }: any) {
  const profile = useProfile((s) => s.profile);
  const setProfile = useProfile((s) => s.setProfile);
  const complete = useProfile((s) => s.completeOnboarding);
  const [displayName, setDisplayName] = useState(profile.displayName ?? 'NovaStriker');
  const [gamerTag, setGamerTag] = useState(profile.gamerTag ?? 'novastriker');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? 'https://i.pravatar.cc/150?img=65');

  const finish = async () => {
    await setProfile({ displayName, gamerTag, avatarUrl, createdAt: new Date().toISOString() });
    await complete();
    navigation.replace('AppTabs');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <ProgressDots step={2} total={2} />
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <TextInput value={avatarUrl} onChangeText={setAvatarUrl} style={styles.input} placeholder="Avatar URL" placeholderTextColor={gamerTheme.colors.textSecondary} />
      <TextInput value={displayName} onChangeText={setDisplayName} style={styles.input} placeholder="Display name" placeholderTextColor={gamerTheme.colors.textSecondary} />
      <TextInput value={gamerTag} onChangeText={setGamerTag} style={styles.input} placeholder="Gamer tag" placeholderTextColor={gamerTheme.colors.textSecondary} />
      <Button title="Finish" onPress={finish} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: gamerTheme.colors.background, padding: 20 },
  title: { color: gamerTheme.colors.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: 12 },
  avatar: { width: 96, height: 96, borderRadius: 48, alignSelf: 'center', marginBottom: 12 },
  input: { backgroundColor: gamerTheme.colors.surface, borderColor: gamerTheme.colors.border, borderWidth: 1, color: gamerTheme.colors.textPrimary, borderRadius: 12, paddingHorizontal: 12, marginBottom: 12 },
});


