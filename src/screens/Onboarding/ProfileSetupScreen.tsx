import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Alert } from 'react-native';
import Button from '@/components/Button';
import { gamerTheme } from '@/theme/theme';
import { useAuth } from '@/store/auth';
import { useMutation } from '@tanstack/react-query';
import { updateProfile } from '@/api/user';
import Input from '@/components/Input';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  ProfileSetup: undefined;
  AppTabs: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

export default function ProfileSetupScreen({ navigation }: Props) {
  const { user, setUser } = useAuth((s) => ({ user: s.user, setUser: s.setUser }));
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [gamerTag, setGamerTag] = useState(user?.email ? user.email.split('@')[0] : '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || `https://i.pravatar.cc/150?u=${user?.email}`);

  const mutation = useMutation({ 
    mutationFn: updateProfile,
    onSuccess: (response) => {
      setUser(response.data.user);
      // The user is now onboarded, and the main app stack will be shown.
      // App.tsx will handle the navigation state.
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.error || 'Could not update profile.');
    },
  });

  const finish = () => {
    if (mutation.isPending) return;
    mutation.mutate({ displayName, gamerTag, avatarUrl });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Set Up Your Profile</Text>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <Input label="Avatar URL" value={avatarUrl} onChangeText={setAvatarUrl} placeholder="https://your-avatar-url.com" />
      <Input label="Display Name" value={displayName} onChangeText={setDisplayName} placeholder="Your awesome name" />
      <Input label="Gamer Tag" value={gamerTag} onChangeText={setGamerTag} placeholder="your-gamer-tag" />
      <View style={styles.actions}>
        <Button title="Finish" onPress={finish} loading={mutation.isPending} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: gamerTheme.colors.background, padding: 20 },
  title: { color: gamerTheme.colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 24, textAlign: 'center' },
  avatar: { width: 96, height: 96, borderRadius: 48, alignSelf: 'center', marginBottom: 24 },
  actions: {
    marginTop: 'auto',
  },
});


