import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { listNearbyUsers, User } from '@/api/users';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gamerTheme } from '@/styles/gamer_theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

export default function DiscoverScreen() {
  const { data: nearbyUsers, isLoading, error } = useQuery<User[]>({ queryKey: ['users', 'nearby'], queryFn: listNearbyUsers });
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Discover</Text>
          <View style={styles.headerIcons}>
            <Icon name="map-marker-outline" color={gamerTheme.colors.textSecondary} size={20} />
            <Icon name="bell-outline" color={gamerTheme.colors.textSecondary} size={20} />
          </View>
        </View>

      <View style={styles.searchBox}>
        <Icon name="magnify" size={20} color={gamerTheme.colors.textSecondary} />
        <TextInput style={styles.input} placeholder="Search players, games, or squads..." placeholderTextColor={gamerTheme.colors.textSecondary} />
      </View>

      <View style={styles.chipsRow}>
        <FilterChip text="Near Me" active />
        <FilterChip text="Has Mic" />
        <FilterChip text="Online Now" />
        <FilterChip text="My Games" />
      </View>

      <GradientCard
        icon="account-multiple-outline"
        title="Find Your Friends"
        subtitle="Import friends from Steam, Xbox, Discord, or your contacts to see who's already on gameotion"
        ctaText="Sync Friends"
      />

      <DiscoverCard
        icon="calendar-outline"
        title="Local Gaming Events"
        subtitle="Gaming cafe tournaments and meetups happening near you this week"
        ctaText="View Events"
        muted
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Players Near You</Text>
        {nearbyUsers && !isLoading && <Text style={styles.sectionCount}>{nearbyUsers.length} found</Text>}
      </View>
        {isLoading && <ActivityIndicator color={gamerTheme.colors.primary} style={{ marginVertical: 20 }} />}
        {error && <Text style={styles.errorText}>Could not fetch players.</Text>}
        {nearbyUsers?.map((user) => <PlayerCard key={user.id} user={user} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gamerTheme.colors.background,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 0, paddingBottom: 10 },
  screenTitle: { color: gamerTheme.colors.textPrimary, fontSize: 20, fontWeight: '900' },
  headerIcons: { flexDirection: 'row', gap: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0E0E16', borderWidth: 1, borderColor: gamerTheme.colors.border, borderRadius: 12, marginHorizontal: 16, paddingHorizontal: 10, height: 44 },
  input: { color: gamerTheme.colors.textPrimary, marginLeft: 8, flex: 1 },
  chipsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 6, marginBottom: 8 },
  sectionTitle: { color: gamerTheme.colors.textPrimary, fontWeight: '900' },
  sectionCount: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  errorText: { color: gamerTheme.colors.error, textAlign: 'center', marginVertical: 20 },
});

function FilterChip({ text, active = false }: { text: string; active?: boolean }) {
  return (
    <View style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: active ? gamerTheme.colors.accent : gamerTheme.colors.border, backgroundColor: active ? '#0A1820' : 'transparent' }}>
      <Text style={{ color: active ? '#ffffff' : gamerTheme.colors.textSecondary, fontWeight: '800', fontSize: 12 }}>{text}</Text>
    </View>
  );
}

function GradientCard({ icon, title, subtitle, ctaText }: { icon: string; title: string; subtitle: string; ctaText: string }) {
  return (
    <LinearGradient colors={["#7B61FF", "#FF33B0"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 16, padding: 1.25, marginHorizontal: 16, marginBottom: 12 }}>
      <View style={{ borderRadius: 16, backgroundColor: gamerTheme.colors.surface, padding: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Icon name={icon} size={18} color={gamerTheme.colors.accent} />
          <Text style={{ color: gamerTheme.colors.textPrimary, fontWeight: '800' }}>{title}</Text>
        </View>
        <Text style={{ color: gamerTheme.colors.textSecondary }}>{subtitle}</Text>
        <TouchableOpacity activeOpacity={0.9} style={{ alignSelf: 'flex-start', marginTop: 12, backgroundColor: gamerTheme.colors.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: gamerTheme.colors.border }}>
          <Text style={{ color: '#fff', fontWeight: '800' }}>{ctaText}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

function DiscoverCard({ icon, title, subtitle, ctaText, muted }: { icon: string; title: string; subtitle: string; ctaText: string; muted?: boolean }) {
  return (
    <View style={{ marginHorizontal: 16, marginBottom: 12, borderRadius: 16, borderWidth: 1, borderColor: gamerTheme.colors.border, backgroundColor: gamerTheme.colors.surface }}>
      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Icon name={icon} size={18} color={muted ? gamerTheme.colors.textSecondary : gamerTheme.colors.accent} />
          <Text style={{ color: gamerTheme.colors.textPrimary, fontWeight: '800' }}>{title}</Text>
        </View>
        <Text style={{ color: gamerTheme.colors.textSecondary }}>{subtitle}</Text>
        <TouchableOpacity activeOpacity={0.9} style={{ alignSelf: 'flex-start', marginTop: 12, backgroundColor: muted ? '#1D1D28' : gamerTheme.colors.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: gamerTheme.colors.border }}>
          <Text style={{ color: '#fff', fontWeight: '800' }}>{ctaText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PlayerCard({ user }: { user: User }) {
  const { name, distance, location, roles, tags } = user;
  return (
    <View style={{ marginHorizontal: 16, marginBottom: 12, borderRadius: 16, borderWidth: 1, borderColor: gamerTheme.colors.border, backgroundColor: gamerTheme.colors.surface, padding: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#0E0E16', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: gamerTheme.colors.border }}>
            <Text style={{ color: gamerTheme.colors.textPrimary, fontWeight: '900' }}>{name.charAt(0)}</Text>
          </View>
          <Text style={{ color: gamerTheme.colors.textPrimary, fontWeight: '800' }}>{name}</Text>
        </View>
        <Text style={{ color: gamerTheme.colors.textSecondary, fontSize: 12 }}>{distance} • {location.city}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
        {tags.map((t) => (
          <View key={t.label} style={{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, backgroundColor: '#0F1A3A', borderWidth: 1, borderColor: gamerTheme.colors.primary }}>
            <Text style={{ color: '#D6DAFF', fontSize: 12, fontWeight: '800' }}>{t.label}</Text>
          </View>
        ))}
      </View>
      <Text style={{ color: gamerTheme.colors.textSecondary, marginTop: 8 }}>Looking for{`\n`}{roles}</Text>
      <TouchableOpacity activeOpacity={0.9} style={{ alignSelf: 'flex-end', marginTop: 12, backgroundColor: gamerTheme.colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: gamerTheme.colors.border }}>
        <Text style={{ color: '#fff', fontWeight: '800' }}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
}
 


