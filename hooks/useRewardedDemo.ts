import { useCallback, useEffect, useRef, useState } from 'react';
import { useWalk } from '@/hooks/useWalk';
export function useRewardedDemo() {
  const { dispatch, busy } = useWalk();
  const [remaining, setRemaining] = useState(0);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [claiming, setClaiming] = useState(false);
  const lock = useRef(false);
  const mounted = useRef(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stop = useCallback(() => { if (timer.current) clearInterval(timer.current); timer.current = null; }, []);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; stop(); }; }, [stop]);
  const start = useCallback(() => {
    if (lock.current || busy) return;
    stop(); setError(''); setRemaining(30); setOpen(true);
    timer.current = setInterval(() => setRemaining(value => { if (value <= 1) { stop(); return 0; } return value - 1; }), 1000);
  }, [busy, stop]);
  const cancel = useCallback(() => { if (lock.current) return; stop(); setOpen(false); setRemaining(0); }, [stop]);
  const claim = useCallback(async () => {
    if (remaining > 0 || lock.current || busy || !open || error) return;
    lock.current = true; setClaiming(true);
    try {
      const result = await dispatch({ type: 'boost' });
      if (!mounted.current) return;
      if (result.ok) { stop(); setOpen(false); setRemaining(0); }
      else setError(result.error || 'Kazanç uygulanamadı.');
    } finally { lock.current = false; if (mounted.current) setClaiming(false); }
  }, [remaining, busy, open, error, dispatch, stop]);
  const fail = useCallback(() => { if (lock.current) return; stop(); setError('Örnek reklam yüklenemedi. Kazanç verilmedi; kapatıp yeniden deneyin.'); }, [stop]);
  return { remaining, open, error, claiming, start, cancel, claim, fail };
}
