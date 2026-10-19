export function authErrorMessage(error: string): string {
  const value = error.toLowerCase();
  if (value.includes('invalid login credentials')) return 'E-posta adresiniz veya şifreniz hatalı.';
  if (value.includes('email not confirmed')) return 'E-posta adresinizi doğrulamanız gerekiyor.';
  if (value.includes('already registered') || value.includes('already been registered')) return 'Bu e-posta adresiyle bir hesap zaten kayıtlı.';
  if (value.includes('otp') || value.includes('token')) return 'Doğrulama kodu geçersiz veya süresi dolmuş. Yeni bir kod isteyin.';
  if (value.includes('rate') || value.includes('too many') || value.includes('seconds')) return 'Çok fazla deneme yapıldı. Bir süre bekleyip yeniden deneyin.';
  if (value.includes('password')) return 'Şifreniz en az 6 karakter olmalıdır.';
  if (value.includes('email') && value.includes('invalid')) return 'Geçerli bir e-posta adresi girin.';
  if (value.includes('network') || value.includes('fetch')) return 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin.';
  return 'İşlem tamamlanamadı. Bilgilerinizi kontrol edip yeniden deneyin.';
}
