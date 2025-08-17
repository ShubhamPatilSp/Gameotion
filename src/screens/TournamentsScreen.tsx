import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gamerTheme } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TournamentsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Tournaments</Text>
        <Icon name="filter-variant" size={20} color={gamerTheme.colors.textSecondary} />
      </View>

      {/* Filters */}
      <View style={styles.chipsRow}>
        <FilterChip text="Upcoming" active />
        <FilterChip text="Live" />
        <FilterChip text="My Tournaments" />
        <FilterChip text="Clans" />
      </View>
      <View style={styles.chipsRow}>
        <FilterChip text="My Games" activeSecondary />
        <FilterChip text="Free Entry" />
        <FilterChip text="This Week" />
        <FilterChip text="Local" />
      </View>

      <TournamentCard
        title="Summer Championship"
        gameTag="Valorant"
        prize="₹50,000"
        date="Aug 15, 2025 at 6:00 PM IST"
        mode="Online"
        format="5v5 Single Elimination • Entry: ₹500"
        host="ESL India"
        full
        slots="128/128"
      />

      <TournamentCard
        title="Local Gaming Cafe Cup"
        gameTag="COD Mobile"
        prize="₹15,000"
        date="Aug 18, 2025 at 2:00 PM IST"
        mode="Mumbai, India"
        format="5v5 Best of 3 • Entry: ₹200"
        host="GameZone Cafe"
        cta="Register"
        slots="32/48"
      />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: gamerTheme.colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },
  title: { color: gamerTheme.colors.textPrimary, fontSize: 20, fontWeight: '900' },
  chipsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
});

function FilterChip({ text, active, activeSecondary }: { text: string; active?: boolean; activeSecondary?: boolean }) {
  const isActive = active || activeSecondary;
  return (
    <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: isActive ? (active ? gamerTheme.colors.accent : gamerTheme.colors.primary) : gamerTheme.colors.border, backgroundColor: isActive ? '#0A1820' : 'transparent' }}>
      <Text style={{ color: isActive ? '#B6F5FF' : gamerTheme.colors.textSecondary, fontWeight: '800', fontSize: 12 }}>{text}</Text>
    </View>
  );
}

function TournamentCard({ title, gameTag, prize, date, mode, format, host, cta, full, slots }: { title: string; gameTag: string; prize: string; date: string; mode: string; format: string; host: string; cta?: string; full?: boolean; slots: string }) {
  return (
    <View style={{ marginHorizontal: 16, marginBottom: 12, borderRadius: 16, borderWidth: 1, borderColor: gamerTheme.colors.border, backgroundColor: gamerTheme.colors.surface }}>
      <View style={{ padding: 14, gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: gamerTheme.colors.textPrimary, fontWeight: '900' }}>{title}</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
              <Tag label={gameTag} />
            </View>
          </View>
          <Icon name="plus-circle-outline" color={gamerTheme.colors.accent} size={20} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: '#30D158', fontWeight: '900' }}>$</Text>
            <Text style={{ color: '#30D158', fontWeight: '900' }}>{prize}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="account-multiple-outline" size={16} color={gamerTheme.colors.textSecondary} />
            <Text style={{ color: gamerTheme.colors.textSecondary, fontSize: 12 }}>{slots}</Text>
          </View>
        </View>

        <InfoRow icon="calendar" text={date} />
        <InfoRow icon="map-marker" text={mode} />
        <Text style={{ color: gamerTheme.colors.textSecondary, fontSize: 12 }}>Format: {format}</Text>
        <Text style={{ color: gamerTheme.colors.textSecondary, fontSize: 12 }}>by {host}</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          {full ? (
            <View style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#1D1D28', borderWidth: 1, borderColor: gamerTheme.colors.border }}>
              <Text style={{ color: gamerTheme.colors.textSecondary, fontWeight: '800' }}>Full</Text>
            </View>
          ) : cta ? (
            <TouchableOpacity activeOpacity={0.9} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: gamerTheme.colors.primary, borderWidth: 1, borderColor: gamerTheme.colors.border }}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>{cta}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, backgroundColor: '#0F1A3A', borderWidth: 1, borderColor: gamerTheme.colors.primary }}>
      <Text style={{ color: '#D6DAFF', fontSize: 12, fontWeight: '800' }}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Icon name={icon} size={16} color={gamerTheme.colors.textSecondary} />
      <Text style={{ color: gamerTheme.colors.textSecondary, fontSize: 12 }}>{text}</Text>
    </View>
  );
}


