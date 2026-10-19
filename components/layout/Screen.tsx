import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useWalk } from '@/hooks/useWalk';
import { useSession } from '@/hooks/useSession';
import { theme as t } from '@/constants/theme';
import { Button, ErrorNote, Tag } from '@/components/ui/Primitives';
interface ScreenProps { children: ReactNode }
export function Screen({ children }: ScreenProps) {
  const session = useSession();
  const { loading, storageError, reload, busy } = useWalk();
  if (!session.loading && !session.user) return <Redirect href="/" />;
  return <SafeAreaView edges={['top']} style={styles.safe}><View style={styles.container}><View style={styles.header}><View style={styles.brand}><View style={styles.mark}><Ionicons name="footsteps-outline" size={22} color={t.colors.ink} /></View><Text accessibilityLabel="WalkToEarn" style={styles.brandText}>walk<Text style={styles.brandAccent}>to</Text>earn<Text style={styles.dot}>.</Text></Text></View><View style={styles.actions}><Pressable accessibilityRole="button" accessibilityLabel="Deneme sürümü hakkında bilgi" onPress={session.showInfo} style={({ pressed }) => [styles.demoPress, { opacity: pressed ? 0.5 : 1 }]}><Tag text="DENEME" tone="muted" /></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Hesabım" onPress={session.showAccount} disabled={session.busy || busy} style={({ pressed }) => [styles.icon, { opacity: pressed ? 0.5 : 1 }]}><Ionicons name="person-circle-outline" size={26} color={t.colors.text} /></Pressable></View></View>{storageError ? <View style={styles.notice}><ErrorNote message={storageError} /><Button label="Yeniden Dene" variant="secondary" onPress={() => void reload()} disabled={busy} /></View> : null}{loading || session.loading ? <View style={styles.loader}><ActivityIndicator color={t.colors.primary} /><Text style={styles.loading}>Hesabınız yükleniyor…</Text></View> : children}</View></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: t.colors.background }, container: { flex: 1, width: '100%', maxWidth: 1008, alignSelf: 'center' },
  header: { paddingHorizontal: t.spacing.md, minHeight: 80, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: t.colors.border, gap: t.spacing.sm },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 }, mark: { height: 36, width: 36, borderRadius: t.radius.sm, backgroundColor: t.colors.primary, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }] },
  brandText: { color: t.colors.text, fontSize: 20, fontWeight: '700', letterSpacing: -0.8 }, brandAccent: { color: t.colors.subtle }, dot: { color: t.colors.primary },
  actions: { flexDirection: 'row', alignItems: 'center' }, demoPress: { minHeight: 48, justifyContent: 'center' }, icon: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  notice: { padding: t.spacing.md, gap: t.spacing.sm }, loader: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: t.spacing.md }, loading: { color: t.colors.subtle, fontSize: t.font.body },
});
