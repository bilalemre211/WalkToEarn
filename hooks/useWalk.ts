import { useContext } from 'react';
import { WalkContext } from '@/contexts/WalkContext';
export function useWalk() { const context = useContext(WalkContext); if (!context) throw new Error('Yürüyüş verileri için WalkProvider gereklidir.'); return context; }
