import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clan, joinClan, listClans } from '../api/clans';

const ClanCard = ({ clan, onJoin, isJoining }: { clan: Clan; onJoin: (id: string) => void; isJoining: boolean }) => (
  <View style={styles.clanCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.clanName}>{clan.name}</Text>
      <Text style={styles.clanTag}>[{clan.tag}]</Text>
    </View>
    <Text style={styles.clanDescription}>{clan.description}</Text>
    <View style={styles.clanMeta}>
      <Text style={styles.metaText}>{clan.membersCount}/{clan.membersMax} Members</Text>
      <Text style={styles.metaText}>Level {clan.level}</Text>
    </View>
    <Pressable style={styles.joinButton} onPress={() => onJoin(clan.id)} disabled={isJoining}>
      <Text style={styles.joinButtonText}>Join</Text>
    </Pressable>
  </View>
);

export default function DiscoverClansScreen() {
  const queryClient = useQueryClient();

  const { data: clans, isLoading, error } = useQuery({ 
    queryKey: ['clans'], 
    queryFn: listClans 
  });

  const joinMutation = useMutation({
    mutationFn: joinClan,
    onSuccess: () => {
      Alert.alert('Success', 'Joined clan successfully!');
      queryClient.invalidateQueries({ queryKey: ['clans'] });
      queryClient.invalidateQueries({ queryKey: ['my-clans'] });
    },
    onError: (err: Error) => {
      Alert.alert('Error', err.message || 'Could not join clan.');
    },
  });

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} />;
  }

  if (error) {
    return <Text style={styles.centered}>Error fetching clans.</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={clans}
        renderItem={({ item }) => <ClanCard clan={item} onJoin={joinMutation.mutate} isJoining={joinMutation.isPending} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  clanCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  clanName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  clanTag: {
    color: '#888',
    fontSize: 16,
  },
  clanDescription: {
    color: '#ccc',
    marginBottom: 12,
  },
  clanMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaText: {
    color: '#888',
  },
  joinButton: {
    backgroundColor: '#5A45FF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
