import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { gamerTheme } from '@/theme/theme';
import Button from '@/components/Button';
import api from '@/api/client';
import { useAuth } from '@/store/auth';

export default function VerifyOTPScreen({ route }: any) {
  const { email, code: suggested } = route.params ?? {};
  const [code, setCode] = useState<string>(suggested ?? '');
  const [loading, setLoading] = useState(false);
  const setSession = useAuth((s) => s.setSession);

  const verify = async () => {
    if (!email || !code) return Alert.alert('Missing', 'Email and code required');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, code });
      const { token, user } = res.data;
      await setSession(token, user);
      Alert.alert('Welcome', `Signed in as ${user.name}`);
    } catch (e) {
      Alert.alert('Invalid code', 'Please retry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>We sent a 6-digit code to {email}</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="123456"
        placeholderTextColor={gamerTheme.colors.textSecondary}
        keyboardType="number-pad"
        style={styles.input}
        maxLength={6}
      />
      <Button title={loading ? 'Verifying…' : 'Verify'} onPress={verify} />
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
    letterSpacing: 2,
    textAlign: 'center',
    fontSize: 18,
  },
});


