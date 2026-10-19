import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth, useAlert } from '@/template';
export function useSession() {
  const { user, loading, logout, operationLoading } = useAuth();
  const { showAlert } = useAlert();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const signOut = useCallback(async () => {
    if (busy || operationLoading) return;
    setBusy(true);
    try {
      const result = await logout();
      if (result.error) { showAlert('Çıkış yapılamadı', 'İnternet bağlantınızı kontrol edip yeniden deneyin.', [{ text: 'Tamam' }]); return; }
      router.replace('/');
    } catch { showAlert('Çıkış yapılamadı', 'Lütfen yeniden deneyin.', [{ text: 'Tamam' }]); }
    finally { setBusy(false); }
  }, [busy, operationLoading, logout, router, showAlert]);
  const showAccount = useCallback(() => {
    if (busy || operationLoading) return;
    showAlert('Hesabım', user?.email || '', [{ text: 'Kapat', style: 'cancel' }, { text: 'Çıkış Yap', onPress: () => void signOut() }]);
  }, [user?.email, busy, operationLoading, showAlert, signOut]);
  const showInfo = useCallback(() => showAlert('Deneme Sürümü', 'Adımlar, reklamlar ve kazançlar örnektir. Talepler kullanıcı hesabına özel OnSpace Cloud veritabanına kaydedilir ve deneme olarak işaretlenir. Gerçek para transferi yapılmaz. Gerçek banka bilgilerinizi kullanmayın.', [{ text: 'Tamam' }]), [showAlert]);
  return { user, loading, busy: busy || operationLoading, showAccount, showInfo };
}
