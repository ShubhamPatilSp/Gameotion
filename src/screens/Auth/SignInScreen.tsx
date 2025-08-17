import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { gamerTheme } from '@/theme/theme';
import Button from '@/components/Button';
import api from '@/api/client';

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('demo@gv.app');
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    if (!email.includes('@')) return Alert.alert('Invalid', 'Enter a valid email');
    setLoading(true);
    try {
      const res = await api.post('/auth/request-otp', { email });
      const code = res.data?.code;
      navigation.navigate('Verify', { email, code });
    } catch (e) {
      Alert.alert('Error', 'Could not request OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to gameotion</Text>
      <Text style={styles.subtitle}>Sign in with email to continue</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor={gamerTheme.colors.textSecondary}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <Button title={loading ? 'Sending…' : 'Send OTP'} onPress={requestOtp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: gamerTheme.colors.background, padding: 20, justifyContent: 'center' },
  title: { color: gamerTheme.colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: gamerTheme.colors.textSecondary, marginBottom: 20 },
  input: {
    backgroundColor: gamerTheme.colors.surface,
    borderWidth: 1,
    borderColor: gamerTheme.colors.border,
    color: gamerTheme.colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
});


