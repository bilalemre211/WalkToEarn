import { useCallback, useRef, useState } from 'react';
import { useAlert } from '@/template';
import { useWalk } from '@/hooks/useWalk';
import { createRequestId, normalizeIban, validateWithdrawal, WITHDRAWAL_SUCCESS } from '@/services/walkService';
export function useWithdrawal() {
  const { state, dispatch, busy } = useWalk();
  const { showAlert } = useAlert();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [bank, setBank] = useState('');
  const [iban, setIban] = useState('');
  const [amount, setAmount] = useState('50,00');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const lock = useRef(false);
  const attempt = useRef<{ id: string; fingerprint: string } | null>(null);
  const start = useCallback(() => { setError(''); setSubmitted(false); setOpen(true); }, []);
  const close = useCallback(() => { if (!lock.current) setOpen(false); }, []);
  const submit = useCallback(async () => {
    if (lock.current || busy) return;
    if (attempt.current && state.payouts.some(payout => payout.requestId === attempt.current?.id)) {
      attempt.current = null; setSubmitted(true); setOpen(false); setIban(''); setName('');
      showAlert('Talebiniz alındı', WITHDRAWAL_SUCCESS, [{ text: 'Tamam' }]);
      return;
    }
    const amountNumber = /^\d+(?:[.,]\d{1,2})?$/.test(amount.trim()) ? Number(amount.trim().replace(',', '.')) : NaN;
    const validation = validateWithdrawal(name, bank, iban, amountNumber, state.members[0].coins);
    if (validation) { setError(validation); return; }
    lock.current = true; setSubmitting(true); setError('');
    try {
      const fingerprint = JSON.stringify([name.trim(), bank, normalizeIban(iban), amountNumber]);
      if (!attempt.current || attempt.current.fingerprint !== fingerprint) attempt.current = { id: createRequestId(), fingerprint };
      const result = await dispatch({ type: 'request', requestId: attempt.current.id, name: name.trim(), bank, iban: normalizeIban(iban), amount: amountNumber });
      if (!result.ok) { setError(result.error || 'Talebiniz kaydedilemedi. Yeniden deneyin.'); return; }
      attempt.current = null;
      setSubmitted(true); setOpen(false); setIban(''); setName('');
      showAlert('Talebiniz alındı', WITHDRAWAL_SUCCESS, [{ text: 'Tamam' }]);
    } catch { setError('Talebiniz kaydedilemedi. İnternet bağlantınızı kontrol edip yeniden deneyin.'); }
    finally { lock.current = false; setSubmitting(false); }
  }, [dispatch, busy, state.members, state.payouts, name, bank, iban, amount, showAlert]);
  return { state, open, close, name, setName, bank, setBank, iban, setIban, amount, setAmount, error, submitted, submitting, busy, start, submit };
}
