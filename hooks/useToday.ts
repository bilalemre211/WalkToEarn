import { useCallback, useState } from 'react';
import { useWalk } from '@/hooks/useWalk';
import { formatCoins } from '@/services/walkService';
export function useToday() {
  const walk = useWalk();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const available = Math.max(0, walk.state.steps - walk.state.convertedSteps);
  const rewardCoins = available * 0.01 * (walk.state.boostReady ? 2 : 1);
  const convert = useCallback(async () => { const result = await walk.dispatch({ type: 'convert' }); setError(result.error || ''); if (result.ok) setNotice(`${formatCoins(rewardCoins)} jeton deneme cüzdanınıza eklendi.`); }, [walk.dispatch, rewardCoins]);
  const simulate = useCallback(async (count: number, seconds: number) => { const result = await walk.dispatch({ type: 'steps', count, seconds }); setError(result.error || ''); if (result.ok) { setNotice(count / seconds > 3 ? 'Şüpheli artış reddedildi. Geçerli adımlarınız ve bakiyeniz değişmedi.' : 'Örnek yürüyüş eklendi. Yeni adımlarınızı doğrulayabilirsiniz.'); setToolsOpen(false); } }, [walk.dispatch]);
  return { ...walk, toolsOpen, setToolsOpen, notice, error, available, rewardCoins, convert, simulate };
}
