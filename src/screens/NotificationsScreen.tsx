import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gamerTheme } from '@/theme/theme';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getNotifications, Notification } from '@/api/notifications';

function formatRelative(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diffMs / (1000 * 60));
  if (m < 1) return 'now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function NotificationRow({ item }: { item: Notification }) {
  const renderText = () => {
    switch (item.type) {
      case 'follow':
        return <Text style={styles.notificationText}><Text style={styles.bold}>{item.user.name}</Text> started following you.</Text>;
      case 'like':
        return <Text style={styles.notificationText}><Text style={styles.bold}>{item.user.name}</Text> liked your post: "{item.post?.text}"</Text>;
      case 'comment':
        return <Text style={styles.notificationText}><Text style={styles.bold}>{item.user.name}</Text> commented: "{item.comment}"</Text>;
      default:
        return null;
    }
  };

  const createdAt = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });

  return (
    <View style={styles.notificationRow}>
      <Image source={{ uri: item.user.avatarUrl }} style={styles.avatar} />
      <View style={styles.textContainer}>
        {renderText()}
        <Text style={styles.time}>{createdAt}</Text>
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  const { data: notifications, isLoading, error } = useQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: getNotifications
  });

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={gamerTheme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Failed to load notifications.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationRow item={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No new notifications.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gamerTheme.colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: gamerTheme.colors.textSecondary,
    fontSize: 16,
  },
  emptyText: {
    color: gamerTheme.colors.textSecondary,
    fontSize: 16,
    marginTop: 50,
  },
  header: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: gamerTheme.colors.border,
    marginHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationText: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
  },
  time: {
    color: gamerTheme.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
});
