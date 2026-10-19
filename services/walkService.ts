import { getSupabaseClient } from '@/template';
import * as Crypto from 'expo-crypto';

export const DAILY_CAP = 15000;
export const MIN_PAYOUT = 50;
export const BANKS = ['Ziraat Bankası', 'İş Bankası', 'Garanti BBVA', 'Akbank', 'Yapı Kredi', 'Halkbank', 'VakıfBank', 'Diğer'];
export const PAYOUT_LABELS = { PENDING: 'Beklemede', APPROVED: 'Onaylandı', REJECTED: 'Reddedildi' } as const;
export const WITHDRAWAL_SUCCESS = 'Talebiniz başarıyla alındı. İnceleme sonrası ödemeniz IBAN hesabınıza aktarılacaktır.';
export type PayoutStatus = keyof typeof PAYOUT_LABELS;
export interface Member { uid: string; name: string; email: string; coins: number; totalSteps: number; isBanned: boolean }
export interface Payout { requestId: string; userId: string; userName: string; email: string; iban: string; bankName: string; amountTL: number; coinsDeducted: number; status: PayoutStatus; requestedAt: string }
export interface Activity { id: string; title: string; detail: string; coins: number; type: 'steps' | 'boost' | 'payout' | 'refund' | 'fraud'; date: string }
export interface WalkState { version: 1; day: string; steps: number; convertedSteps: number; earnedToday: number; lifetimeCoins: number; boostReady: boolean; boostUsed: boolean; adImpressions: number; members: Member[]; payouts: Payout[]; activity: Activity[] }
export type WalkAction = { type: 'steps'; count: number; seconds: number } | { type: 'convert' } | { type: 'boost' } | { type: 'request'; requestId: string; name: string; bank: string; iban: string; amount: number } | { type: 'rollover' };
export const todayKey = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' });
export const round = (n: number) => Math.round(n * 100) / 100;
export const formatCoins = (n: number) => n.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
export const formatTL = (n: number) => `${n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`;
export const normalizeIban = (value: string) => value.replace(/\s/g, '').toUpperCase();
export const createRequestId = () => Crypto.randomUUID();
export function validateIban(value: string) {
  const iban = normalizeIban(value);
  if (!/^TR\d{24}$/.test(iban)) return false;
  const digits = (iban.slice(4) + iban.slice(0, 4)).replace(/[A-Z]/g, char => String(char.charCodeAt(0) - 55));
  let remainder = 0;
  for (const char of digits) remainder = (remainder * 10 + Number(char)) % 97;
  return remainder === 1;
}
export function validateWithdrawal(name: string, bank: string, iban: string, amount: number, balance: number): string {
  if (name.trim().length < 3 || name.trim().length > 120) return 'Geçerli ad ve soyadınızı girin.';
  if (!BANKS.includes(bank)) return 'Bankanızı seçin.';
  if (!validateIban(iban)) return '26 karakterli, geçerli bir TR IBAN numarası girin.';
  if (!Number.isFinite(amount) || amount < MIN_PAYOUT || amount > 9999999 || round(amount) !== amount) return 'En az 50,00 TL ve en fazla iki ondalık basamaklı tutar girin.';
  if (round(amount * 20) > balance) return 'Jeton bakiyeniz yetersiz.';
  return '';
}
export function initialState(): WalkState {
  return { version: 1, day: todayKey(), steps: 0, convertedSteps: 0, earnedToday: 0, lifetimeCoins: 0, boostReady: false, boostUsed: false, adImpressions: 0, members: [{ uid: '', name: 'Yürüyüşçü', email: '', coins: 0, totalSteps: 0, isBanned: false }], payouts: [], activity: [] };
}
const allowedErrors = [
  'Para çekme talebi için giriş yapmalısınız.', 'Hesabınız hazırlanıyor. Lütfen yeniden deneyin.', 'Geçersiz işlem.',
  'Hesabınızda kazanç ve para çekme işlemleri durdurulmuştur.', 'Geçerli bir adım sayısı ve süre girin.',
  'Günlük 15.000 adım sınırına ulaştınız.', 'Günlük 2x kazanç hakkınızı kullandınız.', 'Dönüştürülecek yeni adım yok.',
  'Talep kimliği oluşturulamadı. Yeniden deneyin.', 'Geçerli ad ve soyadınızı girin.', 'Bankanızı seçin.',
  '26 karakterli, geçerli bir TR IBAN numarası girin.', 'En az 50,00 TL ve en fazla iki ondalık basamaklı tutar girin.', 'Jeton bakiyeniz yetersiz.',
];
export async function performWalkAction(action: WalkAction | { type: 'load' }): Promise<WalkState> {
  try {
    const { data, error } = await getSupabaseClient().rpc('walk_demo_action', { action });
    if (error) {
      const translated = allowedErrors.find(message => error.message.includes(message));
      throw new Error(translated || 'İşlem tamamlanamadı. İnternet bağlantınızı kontrol edip yeniden deneyin.');
    }
    if (!data || data.version !== 1 || !data.members?.[0] || !Array.isArray(data.payouts) || !Array.isArray(data.activity)) throw new Error('Hesap verileri alınamadı. Lütfen yeniden deneyin.');
    return data as WalkState;
  } catch (error) {
    if (error instanceof Error && (allowedErrors.includes(error.message) || error.message.startsWith('İşlem tamamlanamadı') || error.message.startsWith('Hesap verileri'))) throw error;
    throw new Error('Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip yeniden deneyin.');
  }
}
