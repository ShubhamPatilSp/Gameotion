import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { gamerTheme } from '@/theme/theme';

export default function HeaderBar() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Feed</Text>
      <View style={styles.row}>
        <Text style={styles.title}>GamerVerse</Text>
        <View style={styles.actions}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('CreatePost')}>
            <Icon name="plus" size={22} color={gamerTheme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Search' as never)}>
            <Icon name="magnify" size={22} color={gamerTheme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications' as never)}>
            <Icon name="bell-outline" size={22} color={gamerTheme.colors.textPrimary} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, paddingTop: 6, paddingBottom: 6 },
  screenTitle: { color: gamerTheme.colors.textSecondary, fontSize: 14, marginBottom: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: gamerTheme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  actions: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gamerTheme.colors.surface,
    borderWidth: 1,
    borderColor: gamerTheme.colors.border,
    position: 'relative',
  },
  badge: { position: 'absolute', right: 6, top: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF33B0' },
});


