import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { gamerTheme } from '@/theme/theme';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const [locationVisible, setLocationVisible] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toxicityLevel, setToxicityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [darkTheme, setDarkTheme] = useState(true);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={gamerTheme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 32 }}>
        <Section title="ACCOUNT">
          <Row title="Edit Profile" subtitle="Update your profile information" leadingIcon="account-edit" trailingIcon="chevron-right" />
          <Row title="Privacy & Safety" subtitle="Control who can see your information" leadingIcon="shield-account" trailingIcon="chevron-right" />
        </Section>

        <Section title="PRIVACY">
          <Row
            title="Location Visibility"
            subtitle={locationVisible ? 'Location is visible' : 'Location is hidden'}
            leadingIcon="map-marker-off"
            trailing={<Switch 
              value={locationVisible} 
              onValueChange={setLocationVisible}
              trackColor={{ false: gamerTheme.colors.border, true: gamerTheme.colors.accent }}
              thumbColor={locationVisible ? '#fff' : gamerTheme.colors.textSecondary}
            />}
          />
        </Section>

        <Section title="NOTIFICATIONS">
          <Row
            title="Push Notifications"
            subtitle="Get notified about messages and updates"
            leadingIcon="bell-outline"
            trailing={<Switch 
              value={pushEnabled} 
              onValueChange={setPushEnabled}
              trackColor={{ false: gamerTheme.colors.border, true: gamerTheme.colors.accent }}
              thumbColor={pushEnabled ? '#fff' : gamerTheme.colors.textSecondary}
            />}
          />
          <Row
            title="Sound Effects"
            subtitle="Play sounds for notifications and actions"
            leadingIcon="volume-high"
            trailing={<Switch 
              value={soundEnabled} 
              onValueChange={setSoundEnabled}
              trackColor={{ false: gamerTheme.colors.border, true: gamerTheme.colors.accent }}
              thumbColor={soundEnabled ? '#fff' : gamerTheme.colors.textSecondary}
            />}
          />
        </Section>

        <Section title="SAFETY">
          <View style={styles.safetyHeader}>
            <Text style={styles.safetyTitle}>AI Toxicity Filter</Text>
            <Text style={styles.safetySubtitle}>Currently: {capitalize(toxicityLevel)}</Text>
          </View>
          <RadioRow label="Low" subtitle="Basic filtering" selected={toxicityLevel === 'low'} onPress={() => setToxicityLevel('low')} />
          <RadioRow label="Medium" subtitle="Recommended" selected={toxicityLevel === 'medium'} onPress={() => setToxicityLevel('medium')} />
          <RadioRow label="High" subtitle="Strict filtering" selected={toxicityLevel === 'high'} onPress={() => setToxicityLevel('high')} />
        </Section>

        <Section title="APPEARANCE">
          <Row
            title="Theme"
            subtitle={darkTheme ? 'Dark mode (recommended)' : 'Light mode'}
            leadingIcon="monitor"
            trailing={<Switch 
              value={darkTheme} 
              onValueChange={setDarkTheme}
              trackColor={{ false: gamerTheme.colors.border, true: gamerTheme.colors.accent }}
              thumbColor={darkTheme ? '#fff' : gamerTheme.colors.textSecondary}
            />}
          />
        </Section>

        <Section title="SUPPORT">
          <Row title="Help Center" subtitle="FAQs and support articles" leadingIcon="help-circle-outline" trailingIcon="chevron-right" />
          <Row title="About gameotion" subtitle="Version 1.0.0" leadingIcon="information-outline" trailingIcon="chevron-right" />
        </Section>

        <Section title="ACCOUNT">
          <Row title="Sign Out" subtitle="Sign out of your account" leadingIcon="logout" emphasize trailingIcon="chevron-right" />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Row({ title, subtitle, leadingIcon, trailingIcon, trailing, emphasize }: { title: string; subtitle?: string; leadingIcon?: string; trailingIcon?: string; trailing?: React.ReactNode; emphasize?: boolean }) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7}>
      <View style={styles.rowLeft}>
        {leadingIcon ? (
          <View style={[styles.iconCircle, emphasize && styles.iconCircleEmphasize]}>
            <Icon name={leadingIcon} size={18} color={emphasize ? '#FF6B6B' : gamerTheme.colors.textPrimary} />
          </View>
        ) : null}
        <View style={styles.rowContent}>
          <Text style={[styles.rowTitle, emphasize && { color: '#FF6B6B' }]}>{title}</Text>
          {!!subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {trailing ? trailing : trailingIcon ? <Icon name={trailingIcon} size={20} color={gamerTheme.colors.textSecondary} /> : null}
    </TouchableOpacity>
  );
}

function RadioRow({ label, subtitle, selected, onPress }: { label: string; subtitle?: string; selected?: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.radioRow}>
      <View style={styles.radioContent}>
        <Text style={styles.rowTitle}>{label}</Text>
        {!!subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>
      <Icon name={selected ? 'radiobox-marked' : 'radiobox-blank'} size={20} color={selected ? gamerTheme.colors.accent : gamerTheme.colors.textSecondary} />
    </TouchableOpacity>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: gamerTheme.colors.background },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: gamerTheme.colors.border,
  },
  backButton: { padding: 4 },
  headerTitle: { color: gamerTheme.colors.textPrimary, fontWeight: '900', fontSize: 20 },
  headerSpacer: { width: 32 },
  scrollView: { flex: 1 },
  section: { marginBottom: 16 },
  sectionTitle: { color: gamerTheme.colors.textSecondary, fontSize: 12, fontWeight: '600', paddingHorizontal: 16, marginBottom: 8 },
  card: { 
    borderTopWidth: 1, 
    borderBottomWidth: 1, 
    borderColor: gamerTheme.colors.border, 
    backgroundColor: gamerTheme.colors.surface,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: gamerTheme.colors.border,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowContent: { flex: 1, marginLeft: 12 },
  iconCircle: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#0E0E16', 
    borderWidth: 1, 
    borderColor: gamerTheme.colors.border 
  },
  iconCircleEmphasize: { borderColor: '#FF6B6B' },
  rowTitle: { color: gamerTheme.colors.textPrimary, fontWeight: '700', fontSize: 16 },
  rowSubtitle: { color: gamerTheme.colors.textSecondary, fontSize: 13, marginTop: 2 },
  safetyHeader: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: gamerTheme.colors.border },
  safetyTitle: { color: gamerTheme.colors.textSecondary, fontSize: 12, fontWeight: '600' },
  safetySubtitle: { color: gamerTheme.colors.textSecondary, fontSize: 12, marginTop: 2 },
  radioRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: gamerTheme.colors.border,
  },
  radioContent: { flex: 1 },
});


