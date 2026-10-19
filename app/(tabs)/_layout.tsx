import Tabs from 'expo-router/tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme as t } from '@/constants/theme';
export function TabLayout() {
  const insets = useSafeAreaInsets();
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: t.colors.primary, tabBarInactiveTintColor: t.colors.subtle, tabBarStyle: [styles.bar, { height: Platform.select({ ios: insets.bottom + 60, android: insets.bottom + 60, default: 70 }), paddingBottom: Platform.select({ ios: insets.bottom + 8, android: insets.bottom + 8, default: 8 }) }], tabBarLabelStyle: styles.label, tabBarItemStyle: styles.item, sceneStyle: { backgroundColor: t.colors.background } }}><Tabs.Screen name="index" options={{ title: 'Bugün', tabBarIcon: ({ color, size }) => <Ionicons name="footsteps-outline" color={color} size={size} /> }} /><Tabs.Screen name="wallet" options={{ title: 'Cüzdan', tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" color={color} size={size} /> }} /><Tabs.Screen name="history" options={{ title: 'Aktivite', tabBarIcon: ({ color, size }) => <Ionicons name="pulse-outline" color={color} size={size} /> }} /></Tabs>;
}
export { TabLayout as default };
const styles = StyleSheet.create({ bar: { paddingTop: 8, paddingHorizontal: 16, backgroundColor: t.colors.background, borderTopWidth: 1, borderTopColor: t.colors.border, elevation: 0 }, label: { fontSize: t.font.tiny, fontWeight: '600' }, item: { maxWidth: 220, minHeight: 48 } });
