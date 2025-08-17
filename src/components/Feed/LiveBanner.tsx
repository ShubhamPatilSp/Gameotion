import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gamerTheme } from '@/theme/theme';

export default function LiveBanner({ onPress }: { onPress?: () => void }) {
  return (
    <LinearGradient colors={["#7B61FF", "#FF33B0"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.wrap}>
      <View style={styles.inner}>
        <View style={styles.left}>
          <View style={styles.livePill}>
            <View style={styles.dot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <View>
            <Text style={styles.title}>Watch Live Streams</Text>
            <Text style={styles.sub}>234 streamers online now</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <LinearGradient colors={["#FF33B0", "#7B61FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
            <Text style={styles.ctaText}>Watch</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    padding: 1,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  inner: {
    backgroundColor: gamerTheme.colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  livePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2A0F2E', borderWidth: 1, borderColor: '#FF33B0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 14, marginRight: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF33B0', marginRight: 6 },
  liveText: { color: '#FF9AD4', fontWeight: '800', fontSize: 12 },
  title: { color: gamerTheme.colors.textPrimary, fontWeight: '800' },
  sub: { color: gamerTheme.colors.textSecondary, fontSize: 12 },
  cta: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 18 },
  ctaText: { color: '#fff', fontWeight: '800' },
});


