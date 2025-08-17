import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gamerTheme } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ClansScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Clans</Text>
        <TouchableOpacity style={styles.addBtn}><Icon name="plus" size={18} color={gamerTheme.colors.textPrimary} /></TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.chipsRow}>
        <Chip text="Discover" active />
        <Chip text="My Clans" />
        <Chip text="Invites" />
      </View>

      <ClanCard
        name="Neon Warriors"
        tag="NEON"
        level="LVL 15"
        region="Asia"
        gameTags={["Valorant", "Diamond"]}
        description="Elite Valorant clan looking for Diamond+ players. Active daily, tournaments every weekend."
        members="127/150"
        founded="2023"
        requirements={["Diamond+ rank, 18+ age, active daily"]}
        recruiting
        cta="Apply"
      />

      <ClanCard
        name="Shadow Legends"
        tag="SHDW"
        level="LVL 12"
        region="India"
        gameTags={["BGMI", "Platinum"]}
        description="Multi-game competitive clan. BGMI, COD Mobile, and more. Family-friendly community."
        members="89/100"
        founded="2024"
        requirements={["Platinum+ rank, good attitude"]}
        recruiting
        cta="Apply"
      />

      <ClanCard
        name="Cyber Phoenixes"
        tag="CYBER"
        level="LVL 25"
        region="Global"
        gameTags={["Multiple", "Immortal"]}
        description="High-level multi-game clan with weekly events and scrims."
        members="210/250"
        founded="2021"
        requirements={["Immortal+ rank, scrim-ready"]}
        cta="Apply"
      />
      </ScrollView>
    </SafeAreaView>
  );
}

function Chip({ text, active = false }: { text: string; active?: boolean }) {
  return (
    <View style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{text}</Text>
    </View>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}><Text style={styles.pillText}>{label}</Text></View>
  );
}

function ClanCard({ name, tag, level, region, gameTags, description, members, founded, requirements, recruiting, cta }: { name: string; tag: string; level: string; region: string; gameTags: string[]; description: string; members: string; founded: string; requirements: string[]; recruiting?: boolean; cta: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.iconCircle}><Icon name="shield-outline" color={gamerTheme.colors.primary} size={20} /></View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.clanName}>{name}</Text>
            <Text style={styles.clanTag}>[{tag}]</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
            {gameTags.map((t) => (
              <Pill key={t} label={t} />
            ))}
          </View>
        </View>
        <View style={styles.levelPill}><Text style={styles.levelText}>{level}</Text></View>
        <Text style={styles.regionText}>{region}</Text>
      </View>

      <Text style={styles.desc}>{description}</Text>

      <View style={styles.statRow}>
        <Text style={styles.statText}><Icon name="account-group-outline" size={14} color={gamerTheme.colors.textSecondary} /> {members} members</Text>
        <Text style={styles.statText}>Founded {founded}</Text>
      </View>

      <Text style={styles.subtle}>Requirements</Text>
      {requirements.map((r) => (
        <Text key={r} style={styles.reqText}>{r}</Text>
      ))}

      <View style={styles.footerRow}>
        {recruiting && (
          <View style={styles.recruitingPill}><Text style={styles.recruitingText}>RECRUITING</Text></View>
        )}
        <TouchableOpacity activeOpacity={0.9} style={styles.applyBtn}><Text style={styles.applyText}>{cta}</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: gamerTheme.colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },
  title: { color: gamerTheme.colors.textPrimary, fontSize: 20, fontWeight: '900' },
  addBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: gamerTheme.colors.surface, borderWidth: 1, borderColor: gamerTheme.colors.border },
  chipsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, borderWidth: 1, borderColor: gamerTheme.colors.border },
  chipActive: { borderColor: gamerTheme.colors.accent, backgroundColor: '#0A1820' },
  chipText: { color: gamerTheme.colors.textSecondary, fontWeight: '800', fontSize: 12 },
  chipTextActive: { color: '#B6F5FF' },

  card: { marginHorizontal: 16, marginBottom: 12, borderRadius: 16, borderWidth: 1, borderColor: gamerTheme.colors.border, backgroundColor: gamerTheme.colors.surface, padding: 14 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: gamerTheme.colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0E0E16' },
  clanName: { color: gamerTheme.colors.textPrimary, fontWeight: '900' },
  clanTag: { color: gamerTheme.colors.accent, fontWeight: '900' },
  levelPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, backgroundColor: '#0F1A3A', borderWidth: 1, borderColor: gamerTheme.colors.primary },
  levelText: { color: '#D6DAFF', fontWeight: '800', fontSize: 12 },
  regionText: { color: gamerTheme.colors.textSecondary, fontSize: 12, marginLeft: 8 },
  desc: { color: gamerTheme.colors.textSecondary, marginTop: 8 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  statText: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  subtle: { color: gamerTheme.colors.textSecondary, fontSize: 12, marginTop: 10 },
  reqText: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  recruitingPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#0F2918', borderWidth: 1, borderColor: '#2ECC71' },
  recruitingText: { color: '#8EF3B0', fontWeight: '800', fontSize: 12 },
  applyBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: gamerTheme.colors.primary, borderWidth: 1, borderColor: gamerTheme.colors.border },
  applyText: { color: '#fff', fontWeight: '800' },
  pill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, backgroundColor: '#0F1A3A', borderWidth: 1, borderColor: gamerTheme.colors.primary },
  pillText: { color: '#D6DAFF', fontSize: 12, fontWeight: '800' },
});


