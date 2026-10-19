import { memo, ReactNode, ComponentProps } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme as t } from '@/constants/theme';
export type IconName = ComponentProps<typeof Ionicons>['name'];
interface ButtonProps { label: string; onPress: () => void; icon?: IconName; variant?: 'primary' | 'secondary' | 'danger'; disabled?: boolean; loading?: boolean; style?: ViewStyle }
export const Button = memo(function Button({ label, onPress, icon, variant = 'primary', disabled = false, loading = false, style }: ButtonProps) {
  const color = variant === 'primary' ? t.colors.ink : variant === 'danger' ? t.colors.danger : t.colors.text;
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: disabled || loading }} disabled={disabled || loading} onPress={onPress} style={({ pressed }) => [styles.button, variant === 'primary' ? styles.primary : variant === 'danger' ? styles.danger : styles.secondary, style, { opacity: disabled ? 0.4 : pressed ? 0.75 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>{loading ? <ActivityIndicator color={color} /> : icon ? <Ionicons name={icon} size={20} color={color} /> : null}<Text style={[styles.buttonText, { color }]}>{label}</Text></Pressable>;
});
interface CardProps { children: ReactNode; style?: ViewStyle }
export const Card = memo(function Card({ children, style }: CardProps) { return <View style={[styles.card, style]}>{children}</View>; });
interface TagProps { text: string; tone?: 'green' | 'muted' | 'warning' | 'danger'; icon?: IconName }
export const Tag = memo(function Tag({ text, tone = 'green', icon }: TagProps) { const color = tone === 'warning' ? t.colors.warning : tone === 'danger' ? t.colors.danger : tone === 'muted' ? t.colors.subtle : t.colors.primary; return <View style={[styles.tag, { backgroundColor: tone === 'green' ? t.colors.primaryDim : tone === 'danger' ? t.colors.dangerDim : tone === 'warning' ? t.colors.warningDim : t.colors.raised }]}>{icon ? <Ionicons name={icon} size={13} color={color} /> : null}<Text style={[styles.tagText, { color }]}>{text}</Text></View>; });
interface ErrorNoteProps { message: string }
export function ErrorNote({ message }: ErrorNoteProps) { return message ? <View accessibilityRole="alert" style={styles.error}><Ionicons name="alert-circle-outline" size={20} color={t.colors.danger} /><Text style={styles.errorText}>{message}</Text></View> : null; }
interface FieldProps { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; keyboardType?: 'default' | 'decimal-pad' | 'email-address' | 'number-pad'; autoCapitalize?: 'none' | 'characters' | 'words'; hint?: string; secureTextEntry?: boolean; editable?: boolean; maxLength?: number }
export function Field({ label, hint, ...props }: FieldProps) { return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...props} accessibilityLabel={label} placeholderTextColor={t.colors.faint} selectionColor={t.colors.primary} style={styles.input} /><Text style={styles.hint}>{hint || ''}</Text></View>; }
interface SheetProps { visible: boolean; onClose: () => void; title: string; children: ReactNode }
export function Sheet({ visible, onClose, title, children }: SheetProps) { return <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}><SafeAreaView style={styles.overlay}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalAvoid}><View style={styles.sheet}><View style={styles.sheetHeader}><Text style={styles.sheetTitle}>{title}</Text><Pressable accessibilityLabel="Pencereyi kapat" accessibilityRole="button" onPress={onClose} style={({ pressed }) => [styles.close, { opacity: pressed ? 0.5 : 1 }]}><Ionicons name="close-outline" size={26} color={t.colors.text} /></Pressable></View><ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>{children}</ScrollView></View></KeyboardAvoidingView></SafeAreaView></Modal>; }
export const ui = StyleSheet.create({
  content: { padding: t.spacing.lg, paddingBottom: t.spacing.xl, gap: t.spacing.lg },
  heading: { color: t.colors.text, fontSize: t.font.title, fontWeight: '700', letterSpacing: -0.8, includeFontPadding: false },
  section: { color: t.colors.text, fontSize: t.font.section, fontWeight: '600', letterSpacing: -0.4 },
  body: { color: t.colors.subtle, fontSize: t.font.body, lineHeight: 26 },
  small: { color: t.colors.subtle, fontSize: t.font.small, lineHeight: 22 },
  eyebrow: { color: t.colors.subtle, fontSize: t.font.tiny, fontWeight: '600', letterSpacing: 1.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: t.spacing.sm },
  stack: { gap: t.spacing.md },
  grow: { flex: 1 },
  divider: { height: 1, backgroundColor: t.colors.border },
  big: { color: t.colors.text, fontSize: t.font.display, fontWeight: '700', letterSpacing: -1.5, includeFontPadding: false },
  primaryText: { color: t.colors.primary },
});
const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: t.radius.sm, paddingHorizontal: t.spacing.md, paddingVertical: t.spacing.sm, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: t.spacing.sm },
  primary: { backgroundColor: t.colors.primary }, secondary: { backgroundColor: t.colors.raised, borderWidth: 1, borderColor: t.colors.border }, danger: { backgroundColor: t.colors.dangerDim, borderWidth: 1, borderColor: t.colors.dangerDim },
  buttonText: { fontSize: t.font.body, fontWeight: '600' },
  card: { backgroundColor: t.colors.surface, borderRadius: t.radius.md, padding: t.spacing.lg, borderWidth: 1, borderColor: t.colors.border, gap: t.spacing.md },
  tag: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: t.spacing.xs, paddingHorizontal: 10, paddingVertical: 6, borderRadius: t.radius.pill },
  tagText: { fontSize: t.font.tiny, fontWeight: '600' },
  field: { gap: t.spacing.sm }, label: { color: t.colors.text, fontSize: t.font.small, fontWeight: '600' },
  input: { color: t.colors.text, backgroundColor: t.colors.raised, borderColor: t.colors.border, borderWidth: 1, borderRadius: t.radius.sm, padding: t.spacing.md, fontSize: t.font.body, minHeight: 54 },
  hint: { color: t.colors.subtle, fontSize: t.font.tiny, lineHeight: 18 },
  error: { backgroundColor: t.colors.dangerDim, padding: t.spacing.md, borderRadius: t.radius.sm, flexDirection: 'row', gap: t.spacing.sm }, errorText: { color: t.colors.danger, fontSize: t.font.small, lineHeight: 22, flex: 1 },
  overlay: { flex: 1, backgroundColor: t.colors.overlay, alignItems: 'center', justifyContent: 'center', padding: t.spacing.md },
  modalAvoid: { width: '100%', maxWidth: 520, height: '94%', flexShrink: 1 },
  sheet: { flex: 1, backgroundColor: t.colors.surface, borderWidth: 1, borderColor: t.colors.border, borderRadius: t.radius.lg, overflow: 'hidden' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.md, gap: t.spacing.sm },
  sheetTitle: { color: t.colors.text, fontSize: t.font.section, fontWeight: '700', flex: 1 },
  close: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  sheetContent: { padding: t.spacing.lg, gap: t.spacing.md },
});
