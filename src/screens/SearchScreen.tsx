import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { gamerTheme } from '@/styles/gamer_theme';
import { Player, searchUsers } from '@/api/users';
import { MainStackParamList } from '@/navigation/types';

const DEBOUNCE_DELAY = 500;

type SearchScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Search'>;
type SearchScreenRouteProp = RouteProp<MainStackParamList, 'Search'>;

function PlayerCard({ player }: { player: Player }) {
  const navigation = useNavigation() as SearchScreenNavigationProp;
  const route = useRoute() as SearchScreenRouteProp;
  const { clanId } = route.params || {};

  return (
    <TouchableOpacity style={styles.playerCard} onPress={() => navigation.navigate('Profile', { userId: player.id, clanId })}>
      <Image source={{ uri: player.avatarUrl || 'https://i.pravatar.cc/150?u=' + player.id }} style={styles.avatar} />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.name}</Text>
        {player.gamerTag && <Text style={styles.playerGamerTag}>@{player.gamerTag}</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const { data: users, isLoading, error } = useQuery<Player[], Error>({
    queryKey: ['users', 'search', debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: !!debouncedQuery,
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for players..."
        placeholderTextColor={gamerTheme.colors.textSecondary}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {isLoading && <ActivityIndicator color={gamerTheme.colors.primary} style={{ marginTop: 20 }} />}
      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
      
      {debouncedQuery && !isLoading && users?.length === 0 && (
        <Text style={styles.noResultsText}>No players found.</Text>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlayerCard player={item} />}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gamerTheme.colors.background,
    paddingHorizontal: 16,
  },
  searchInput: {
    backgroundColor: gamerTheme.colors.card,
    color: gamerTheme.colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: gamerTheme.colors.border,
    marginTop: 10,
  },
  errorText: {
    color: gamerTheme.colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
  noResultsText: {
    color: gamerTheme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: gamerTheme.colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerGamerTag: {
    color: gamerTheme.colors.textSecondary,
    fontSize: 14,
  },
});
