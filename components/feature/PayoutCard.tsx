import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Payout, formatCoins, formatTL, PAYOUT_LABELS } from '@/services/walkService';
import { Card, Tag, ui } from '@/components/ui/Primitives';
import { theme as t } from '@/constants/theme';
interface PayoutCardProps { payout: Payout }
export const PayoutCard = memo(function PayoutCard({ payout }: PayoutCardProps) {
  return <Card><View style={styles.header}><View style={[ui.row, ui.grow]}><View style={styles.bankIcon}><Ionicons name="business-outline" size={23} color={t.colors.primary} /></View><View style={ui.grow}><Text style={styles.name}>{payout.bankName}</Text><Text style={ui.small}>{new Date(payout.requestedAt).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Europe/Istanbul' })}</Text></View></View><Text style={styles.amount}>{formatTL(payout.amountTL)}</Text></View><View style={ui.between}><Tag text={PAYOUT_LABELS[payout.status]} tone={payout.status === 'PENDING' ? 'warning' : payout.status === 'REJECTED' ? 'danger' : 'green'} /><Text style={ui.small}>{formatCoins(payout.coinsDeducted)} jeton</Text></View><Text style={ui.small}>IBAN sonu: {payout.iban.slice(-4)}{payout.status === 'REJECTED' ? ' · talep reddedildi' : payout.status === 'APPROVED' ? ' · onay kaydedildi' : ' · inceleme bekleniyor'}</Text></Card>;
});
const styles = StyleSheet.create({ header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: t.spacing.sm }, bankIcon: { width: 44, height: 44, borderRadius: t.radius.sm, backgroundColor: t.colors.primaryDim, alignItems: 'center', justifyContent: 'center' }, name: { fontSize: t.font.body, fontWeight: '600', color: t.colors.text }, amount: { fontSize: t.font.section, fontWeight: '700', color: t.colors.primary } });
