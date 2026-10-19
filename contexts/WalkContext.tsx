import { createContext, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/template';
import { initialState, performWalkAction, WalkAction, WalkState } from '@/services/walkService';
interface WalkResult { ok: boolean; error?: string }
interface WalkContextValue { state: WalkState; loading: boolean; busy: boolean; storageError: string; dispatch: (action: WalkAction) => Promise<WalkResult>; reload: () => Promise<void> }
export const WalkContext = createContext<WalkContextValue | undefined>(undefined);
export function WalkProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<WalkState>(initialState);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [storageError, setStorageError] = useState('');
  const identity = useRef<string | null>(null);
  const inFlight = useRef<number | null>(null);
  const sequence = useRef(0);
  const ready = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const reload = useCallback(async () => {
    const uid = identity.current;
    if (!uid || inFlight.current !== null) return;
    const token = ++sequence.current;
    inFlight.current = token;
    try {
      const data = await performWalkAction({ type: 'load' });
      if (mounted.current && identity.current === uid) { ready.current = true; setState(data); setStorageError(''); }
    } catch (error) {
      if (mounted.current && identity.current === uid) setStorageError(error instanceof Error ? error.message : 'Hesap verileri alınamadı.');
    } finally { if (inFlight.current === token) { inFlight.current = null; if (mounted.current && identity.current === uid) setLoading(false); } }
  }, []);
  useEffect(() => {
    identity.current = user?.id || null;
    inFlight.current = null;
    setBusy(false);
    ready.current = false;
    setState(initialState());
    setStorageError('');
    setLoading(authLoading || Boolean(user));
    if (!authLoading && user) void reload();
  }, [user?.id, authLoading, reload]);
  const dispatch = useCallback(async (action: WalkAction): Promise<WalkResult> => {
    const uid = identity.current;
    if (!uid) return { ok: false, error: 'Devam etmek için giriş yapmalısınız.' };
    if (!ready.current) return { ok: false, error: 'Hesap verileri yüklenemedi. Önce yeniden deneyin.' };
    if (inFlight.current !== null) return { ok: false, error: 'Devam eden işlem tamamlanınca yeniden deneyin.' };
    const token = ++sequence.current;
    inFlight.current = token;
    setBusy(true);
    try {
      const data = await performWalkAction(action);
      if (!mounted.current || identity.current !== uid) return { ok: false, error: 'Oturum değişti. Lütfen yeniden giriş yapın.' };
      setState(data); setStorageError('');
      return { ok: true };
    } catch (error) { return { ok: false, error: error instanceof Error ? error.message : 'İşlem tamamlanamadı.' }; }
    finally { if (inFlight.current === token) { inFlight.current = null; if (mounted.current && identity.current === uid) setBusy(false); } }
  }, []);
  useEffect(() => {
    if (!user || authLoading) return;
    const timer = setInterval(() => void reload(), 30000);
    return () => clearInterval(timer);
  }, [user?.id, authLoading, reload]);
  return <WalkContext.Provider value={{ state, loading, busy, storageError, dispatch, reload }}>{children}</WalkContext.Provider>;
}
