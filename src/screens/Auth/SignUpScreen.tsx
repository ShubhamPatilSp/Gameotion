import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { gamerTheme } from '@/theme/theme';
import { signUp } from '@/api/auth';
import { useAuth } from '@/store/auth';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const setSession = useAuth((s) => s.setSession);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (loading) return;
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await signUp(email, password);
      await setSession(token, user);
      navigation.navigate('ProfileSetup');
    } catch (e: any) {
      const message = e.message || 'An unexpected error occurred.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button title="< Back" variant="secondary" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Create Account</Text>
      </View>
      <View style={styles.form}>
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@email.com" />
        <Input label="Password" value={password} onChangeText={setPassword} placeholder="********" secureTextEntry />
        <Input label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="********" secureTextEntry error={error} />
      </View>
      <View style={styles.actions}>
        <Button title={loading ? 'Signing Up...' : 'Sign Up'} onPress={handleSignUp} />
      </View>
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
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: gamerTheme.colors.textPrimary,
    marginLeft: 20,
  },
  form: {
    flex: 1,
  },
  actions: {
    paddingBottom: 20,
  },
});
