import { useCallback, useRef, useState } from 'react';
import { useAuth, useAlert } from '@/template';
import { authErrorMessage } from '@/services/authMessages';
export function useLogin() {
  const auth = useAuth();
  const { showAlert } = useAlert();
  const [registering, setRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [otp, setOtp] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const submit = useCallback(async () => {
    if (lock.current || auth.operationLoading) return;
    const address = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) { setError('Geçerli bir e-posta adresi girin.'); return; }
    if (password.length < 6) { setError('Şifreniz en az 6 karakter olmalıdır.'); return; }
    if (registering && password !== confirmation) { setError('Şifreler eşleşmiyor.'); return; }
    if (codeSent && !/^\d{4}$/.test(otp.trim())) { setError('E-postanıza gelen 4 haneli kodu girin.'); return; }
    lock.current = true; setBusy(true); setError('');
    try {
      if (registering && !codeSent) {
        const result = await auth.sendOTP(address);
        if (result.error) { setError(authErrorMessage(result.error)); return; }
        setCodeSent(true);
        showAlert('Doğrulama kodu gönderildi', 'E-postanıza gelen 4 haneli kodu girin.', [{ text: 'Tamam' }]);
      } else {
        const result = registering
          ? await auth.verifyOTPAndLogin(address, otp.trim(), { password })
          : await auth.signInWithPassword(address, password);
        if (result.error) { setError(authErrorMessage(result.error)); return; }
        if (!result.user) setError('Oturum açılamadı. Lütfen yeniden deneyin.');
      }
    } catch { setError('Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin.'); }
    finally { lock.current = false; setBusy(false); }
  }, [email, password, confirmation, otp, registering, codeSent, auth, showAlert]);
  const changeMode = useCallback(() => { if (busy || auth.operationLoading) return; setRegistering(value => !value); setCodeSent(false); setOtp(''); setError(''); }, [busy, auth.operationLoading]);
  const resetCode = useCallback(() => { if (busy || auth.operationLoading) return; setCodeSent(false); setOtp(''); setError(''); }, [busy, auth.operationLoading]);
  return { email, setEmail, password, setPassword, confirmation, setConfirmation, otp, setOtp, registering, codeSent, error, busy: busy || auth.operationLoading, submit, changeMode, resetCode };
}
