import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '@/components/Button';
import { gamerTheme } from '@/theme/theme';
import { useProfile } from '@/store/profile';

export default function EntryScreen({ navigation }: any) {
  const setProfile = useProfile((s) => s.setProfile);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to gameotion</Text>
      <Text style={styles.subtitle}>Play. Create. Connect.</Text>

      <Button title="Continue with Google (demo)" onPress={() => {
        setProfile({ email: 'demo@gv.app', oauthProviders: [{ provider: 'google', providerId: 'demo' }] });
        navigation.navigate('Preferences');
      }} style={{ marginBottom: 12 }} />

      <Button title="Email / Phone (demo)" onPress={() => navigation.navigate('Preferences')} style={{ marginBottom: 12 }} />
      <Button title="Continue as Guest" onPress={() => navigation.navigate('Preferences')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: gamerTheme.colors.background, padding: 20, justifyContent: 'center' },
  title: { color: gamerTheme.colors.textPrimary, fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: gamerTheme.colors.textSecondary, marginBottom: 24 },
});


