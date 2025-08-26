import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listInvites, acceptInvite, rejectInvite, Invite } from '@/api/clans';
import { gamerTheme as theme } from '@/theme/theme';

function InviteCard({ invite }: { invite: Invite }) {
  const queryClient = useQueryClient();

  const mutationOptions = {
    onSuccess: () => {
      // Optimistically update the list of invites to remove the handled one
      queryClient.setQueryData<Invite[]>(['invites'], (oldData) =>
        oldData ? oldData.filter((i) => i.id !== invite.id) : []
      );
      // Invalidate my clans to refetch and show the new clan if accepted
      queryClient.invalidateQueries({ queryKey: ['clans', 'my'] });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  };

  const acceptMutation = useMutation({ mutationFn: () => acceptInvite(invite.id), ...mutationOptions });
  const rejectMutation = useMutation({ mutationFn: () => rejectInvite(invite.id), ...mutationOptions });

  const isProcessing = acceptMutation.isPending || rejectMutation.isPending;

  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.clanName}>{invite.clanName}</Text>
        <Text style={styles.inviter}>Invited by {invite.inviterName}</Text>
      </View>
      <View style={styles.actions}>
        {isProcessing ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <>
            <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => acceptMutation.mutate()}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => rejectMutation.mutate()}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

export default function InvitesScreen() {
  const { data: invites, isLoading, error } = useQuery<Invite[], Error>({
    queryKey: ['invites'],
    queryFn: listInvites,
  });

  if (isLoading) {
    return <ActivityIndicator style={styles.center} size="large" color={theme.colors.primary} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Failed to load invites: {error.message}</Text>;
  }

  if (!invites || invites.length === 0) {
    return <Text style={styles.emptyText}>You have no pending invitations.</Text>;
  }

  return (
    <FlatList
      data={invites}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <InviteCard invite={item} />}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing(2),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: theme.spacing(3),
    color: theme.colors.danger,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: theme.spacing(3),
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBody: {
    flex: 1,
  },
  clanName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  inviter: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing(0.5),
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(2),
    borderRadius: theme.radius.sm,
    marginLeft: theme.spacing(1),
  },
  acceptButton: {
    backgroundColor: theme.colors.primary,
  },
  rejectButton: {
    backgroundColor: theme.colors.danger,
  },
  buttonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
});
