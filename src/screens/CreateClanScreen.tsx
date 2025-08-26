import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { gamerTheme } from '@/theme/theme';
import { createClan } from '@/api/clans';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CreateClanScreen() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');

  const mutation = useMutation({
    mutationFn: createClan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clans'] });
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to create clan');
    },
  });

  const handleCreate = () => {
    if (!name.trim() || !tag.trim()) {
      Alert.alert('Validation Error', 'Clan Name and Tag are required.');
      return;
    }
    mutation.mutate({ name, tag, description });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={gamerTheme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Clan</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Clan Name (e.g., Elite Gamers)"
          placeholderTextColor={gamerTheme.colors.textSecondary}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Clan Tag (e.g., ELITE)"
          placeholderTextColor={gamerTheme.colors.textSecondary}
          value={tag}
          onChangeText={setTag}
          maxLength={5}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description (optional)"
          placeholderTextColor={gamerTheme.colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity
          style={[styles.createButton, mutation.isPending && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={mutation.isPending}
        >
          <Text style={styles.createButtonText}>
            {mutation.isPending ? 'Creating...' : 'Create Clan'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gamerTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: gamerTheme.colors.border,
  },
  headerTitle: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: gamerTheme.colors.surface,
    color: gamerTheme.colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gamerTheme.colors.border,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: gamerTheme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: gamerTheme.colors.surface,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
