import { useMemo, useState } from 'react';
import { useWalk } from '@/hooks/useWalk';
export function useHistory() {
  const { state } = useWalk();
  const [filter, setFilter] = useState('Tümü');
  const activity = useMemo(() => state.activity.filter(item => !(item.type === 'refund' && item.coins === 0)).filter(item => filter === 'Tümü' || (filter === 'Kazançlar' ? item.type === 'steps' || item.type === 'boost' : filter === 'Para Çekme' ? item.type === 'payout' || item.type === 'refund' : item.type === 'fraud')), [state.activity, filter]);
  return { state, filter, setFilter, activity };
}
