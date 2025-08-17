import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Button from '@/components/Button';
import { gamerTheme } from '@/theme/theme';
import { useProfile } from '@/store/profile';
import Chip from '@/components/Chip';
import ProgressDots from '@/components/ProgressDots';

const GAMES = ['valorant', 'cs2', 'apex', 'lol', 'dota2', 'elden_ring'];
const LANGS = ['en', 'hi', 'es', 'fr', 'de'];

export default function PreferencesScreen({ navigation }: any) {
  const profile = useProfile((s) => s.profile);
  const setProfile = useProfile((s) => s.setProfile);
  const [games, setGames] = useState<string[]>(profile.favoriteGames ?? []);
  const [lang, setLang] = useState<string>(profile.languages?.[0] ?? 'en');
  const [country, setCountry] = useState(profile.location?.country ?? '');
  const [city, setCity] = useState(profile.location?.city ?? '');

  const toggleGame = (g: string) => {
    setGames((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const next = async () => {
    await setProfile({ favoriteGames: games, languages: [lang], location: { country, city } });
    navigation.navigate('ProfileSetup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferences</Text>
      <ProgressDots step={1} total={2} />
      <Text style={styles.section}>Favorite games</Text>
      <View style={styles.chips}>
        {GAMES.map((g) => (
          <Chip key={g} label={g} active={games.includes(g)} onPress={() => toggleGame(g)} />
        ))}
      </View>

      <Text style={styles.section}>Language</Text>
      <View style={styles.chips}>
        {LANGS.map((l) => (
          <Chip key={l} label={l} active={lang === l} onPress={() => setLang(l)} />
        ))}
      </View>

      <Text style={styles.section}>Location</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <TextInput placeholder="Country" placeholderTextColor={gamerTheme.colors.textSecondary} value={country} onChangeText={setCountry} style={styles.input} />
        <TextInput placeholder="City" placeholderTextColor={gamerTheme.colors.textSecondary} value={city} onChangeText={setCity} style={styles.input} />
      </View>

      <Button title="Continue" onPress={next} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: gamerTheme.colors.background, padding: 20 },
  title: { color: gamerTheme.colors.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: 12 },
  section: { color: gamerTheme.colors.textSecondary, marginTop: 10, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {},
  chipActive: {},
  chipText: {},
  chipTextActive: {},
  input: { flex: 1, backgroundColor: gamerTheme.colors.surface, borderColor: gamerTheme.colors.border, borderWidth: 1, color: gamerTheme.colors.textPrimary, borderRadius: 12, paddingHorizontal: 12 },
});


