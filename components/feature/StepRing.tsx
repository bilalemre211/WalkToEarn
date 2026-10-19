import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { theme as t } from '@/constants/theme';
import { DAILY_CAP, formatCoins } from '@/services/walkService';
import { useResponsive } from '@/hooks/useResponsive';
interface StepRingProps { steps: number }
export const StepRing = memo(function StepRing({ steps }: StepRingProps) {
  const { width } = useResponsive();
  const size = Math.max(184, Math.min(256, width - t.spacing.lg * 4 - 2));
  const circumference = 2 * Math.PI * 110;
  const progress = Math.min(1, Math.max(0, steps / DAILY_CAP));
  return <View style={[styles.ring, { width: size, height: size }]}><Svg width={size} height={size} viewBox="0 0 256 256"><Circle cx="128" cy="128" r="110" fill="none" stroke={t.colors.raised} strokeWidth="12" /><Circle cx="128" cy="128" r="110" fill="none" stroke={t.colors.primary} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={circumference * (1 - progress)} rotation="-90" origin="128,128" /><Circle cx="128" cy="128" r="92" fill="none" stroke={t.colors.border} strokeWidth="1" strokeDasharray="2 9" /></Svg><View style={styles.center}><Ionicons name="footsteps-outline" size={24} color={t.colors.primary} /><Text style={[styles.steps, { fontSize: size < 240 ? 40 : 48 }]}>{formatCoins(steps)}</Text><Text style={styles.label}>Bugünkü Adım</Text><View style={styles.goal}><View style={styles.dot} /><Text style={styles.goalText}>Günlük sınır: 15.000 adım</Text></View></View></View>;
});
const styles = StyleSheet.create({ ring: { alignSelf: 'center', marginVertical: t.spacing.sm }, center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: t.spacing.sm }, steps: { color: t.colors.text, fontWeight: '700', letterSpacing: -2, includeFontPadding: false }, label: { color: t.colors.subtle, fontSize: t.font.body }, goal: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: t.spacing.sm }, dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: t.colors.primary }, goalText: { color: t.colors.subtle, fontSize: t.font.tiny } });
