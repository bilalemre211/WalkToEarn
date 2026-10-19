import { Redirect } from 'expo-router';
import { AuthRouter, useAuth } from '@/template';
import { LoginLoading, LoginScreen } from '@/components/feature/LoginScreen';
export function IndexPage() {
  const { user } = useAuth();
  return <AuthRouter loginRoute="/" loadingComponent={LoginLoading}>{user ? <Redirect href="/(tabs)" /> : <LoginScreen />}</AuthRouter>;
}
export { IndexPage as default };
