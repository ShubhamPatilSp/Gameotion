import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gamerTheme } from '@/theme/theme';
import { createPost } from '@/api/feed';
import Button from '@/components/Button';
import { useAuth } from '@/store/auth';
import { CreatePostScreenProps } from '@/navigation/types';

export default function CreatePostScreen({ navigation }: CreatePostScreenProps) {
  const [contentText, setContentText] = useState('');
  const queryClient = useQueryClient();
  const user = useAuth((s) => s.user);

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Could not create post.');
    },
  });

  const handlePost = () => {
    if (mutation.isPending) return;
    mutation.mutate({ contentText, city: user?.location?.city });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Post</Text>
        <Button title="Post" onPress={handlePost} loading={mutation.isPending} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        placeholderTextColor={gamerTheme.colors.textSecondary}
        value={contentText}
        onChangeText={setContentText}
        multiline
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gamerTheme.colors.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  input: {
    flex: 1,
    color: gamerTheme.colors.textPrimary,
    fontSize: 18,
    textAlignVertical: 'top',
  },
});
