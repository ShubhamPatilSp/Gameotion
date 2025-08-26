import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '@/components/Button';
import { gamerTheme } from '@/theme/theme';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🎮</Text>
        <Text style={styles.title}>gameotion</Text>
        <Text style={styles.subtitle}>Find your next teammate</Text>
      </View>
      <View style={styles.actions}>
        <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
        <Button title="Log In" variant="secondary" onPress={() => navigation.navigate('Login')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gamerTheme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: gamerTheme.colors.textPrimary,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: gamerTheme.colors.textSecondary,
    marginTop: 8,
  },
  actions: {
    padding: 20,
    paddingBottom: 40,
  },
});
