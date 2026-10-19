import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AlertProvider, AuthProvider } from '@/template';
import { WalkProvider } from '@/contexts/WalkContext';
import { theme } from '@/constants/theme';
export function RootLayout() {
  return <AlertProvider><SafeAreaProvider><AuthProvider><WalkProvider><StatusBar style="light" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}><Stack.Screen name="index" /><Stack.Screen name="(tabs)" /></Stack></WalkProvider></AuthProvider></SafeAreaProvider></AlertProvider>;
}
export { RootLayout as default };
