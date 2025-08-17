import React from 'react';
import { View, FlatList, RefreshControl, Image, Text, StyleSheet } from 'react-native';
import { gamerTheme } from '@/theme/theme';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUserPosts } from '@/api/feed';
import PostHeader from '@/components/Feed/PostHeader';
import PostMetaBar from '@/components/Feed/PostMetaBar';

export default function UserFeedScreen({ route }: any) {
  const { userId, title } = route.params as { userId: string; title: string };

  const { data, isRefetching, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['userFeed', userId],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchUserPosts({ userId, page: Number(pageParam || 1), limit: 12 }),
    getNextPageParam: (last) => last?.nextPage ?? null,
    staleTime: 15_000,
  });

  const items = (data?.pages || []).flatMap((p: any) => p.items);

  return (
    <View style={{ flex: 1, backgroundColor: gamerTheme.colors.background }}>
      <FlatList
        contentContainerStyle={{ padding: 12 }}
        data={items}
        keyExtractor={(item, idx) => `${item.id}-${idx}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <PostHeader name={item.user.name} avatar={item.user.avatarUrl} gameTag={item.gameTags?.[0]} createdAt={item.createdAt} />
            {item.media?.[0]?.url ? (
              <Image source={{ uri: item.media[0].url }} style={styles.media} resizeMode="cover" />
            ) : null}
            <Text style={styles.caption}>{item.contentText}</Text>
            <PostMetaBar likes={item.likesCount || 0} comments={item.commentsCount || 0} views={(item as any).viewsCount || 0} />
          </View>
        )}
        onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl tintColor={gamerTheme.colors.textSecondary} refreshing={isRefetching} onRefresh={() => refetch()} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: gamerTheme.colors.surface, borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: gamerTheme.colors.border },
  media: { width: '100%', height: 180, borderRadius: 12, marginBottom: 10 },
  caption: { color: gamerTheme.colors.textPrimary, marginBottom: 6 },
});


