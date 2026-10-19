# WalkToEarn — Türkçe deneme uygulaması

## Durum
React Native, Expo, TypeScript ve Expo Router kullanılır. Kullanıcı uygulaması yalnızca Bugün, Cüzdan ve Aktivite sekmelerinden oluşur. Arayüz, erişilebilirlik etiketleri, doğrulama mesajları ve tarihler Türkçedir; sayılar tr-TR biçimindedir. Marka adı WalkToEarn olarak kalır.

E-posta/şifre ile giriş ve e-posta kodu ile kayıt OnSpace Cloud kimlik doğrulamasına bağlıdır. Şifre alt sınırı 6 karakter; doğrulama kodu 4 hanelidir. Kayıtta yalnızca e-posta, şifre ve şifre tekrarı alınır. Giriş ve kayıt aynı kök sayfadadır. AuthRouter yalnızca app/index.tsx içinde bulunur; loginRoute="/" kullanımı giriş sayfasını yerinde tutar ve başarılı oturumda yönlendirme AuthRouter üzerinden yürür. AlertProvider en dıştadır; SafeAreaProvider, AuthProvider ve WalkProvider iç katmanlardır.

## Deneme sınırı
Cihaz adımları ve reklamlar hâlâ simülasyondur. Sunucuda hesap başına bir kez örnek bakiye oluşturulur. Bu jetonlar gerçek paraya çevrilmez. Gerçek transfer veya reklam geliri oluşturulmaz. Bu sınır hem giriş ekranında hem Cüzdan ve talep formunda görünürdür. Eski yerel prototip verileri yeni hesaplara otomatik taşınmaz ve silinmez. Banka bilgileri artık AsyncStorage'a yazılmaz.

## Katmanlar
- services/walkService.ts: veri tipleri, Türkçe sayı/para biçimi, IBAN doğrulaması ve RPC çağrısı.
- services/authMessages.ts: kimlik doğrulama hatalarının Türkçe karşılıkları.
- contexts/WalkContext.tsx: oturuma bağlı paylaşılan durum, işlem kilidi, yeniden yükleme ve 30 saniyelik sorgulama.
- hooks/: ekran durumları, kayıt/giriş, çıkış, ödül ve talep iş akışları.
- components/: tasarım sistemi, güvenli alanlar, ekranlar ve form bileşenleri.
- app/: üç sekme, kök kimlik yönlendirmesi ve sağlayıcılar.

## Sunucu işlemleri
OnSpace Cloud PostgreSQL tabloları:
- walk_demo_states: user_id, state (jsonb), updated_at.
- payout_requests: request_id, user_id, user_name, email, iban, bank_name, amount_tl, coins_deducted, status, is_demo, requested_at.

walk_demo_action(jsonb) işlevi oturum kimliğini auth.uid() ile belirler. Hesabın durum satırını kilitler; örnek adımları, günlük dönüşümü ve 2x deneme kazancını işler. Gün Europe/Istanbul saat dilimine göre değişir. 15.000 adım sınırı ve saniyede 3 adım kontrolü sunucu işlevinde uygulanır. İsteğe bağlı örnek reklam, günde bir kez yalnızca sonraki dönüşüm için geçerlidir.

Para çekme işleminde ad soyad, banka, tutar, kullanılabilir bakiye ve TR IBAN MOD-97 kontrolü tekrar sunucuda doğrulanır. En az 50,00 TL talep edilebilir; 100 jeton = 5,00 TL'dir. Talep PENDING ve is_demo=true olarak payout_requests tablosuna eklenir. İlgili jetonlar aynı veritabanı işleminde bakiyeden düşülür. Benzersiz UUID ve satır kilidi tekrarlanan taleplerde çift kesintiyi engeller. Ağ yanıtı kaybolursa aynı form aynı talep kimliğiyle yeniden denenir.

Başarı uyarısı yalnızca sunucu işlemi tamamlandığında gösterilir:
“Talebiniz başarıyla alındı. İnceleme sonrası ödemeniz IBAN hesabınıza aktarılacaktır.”
Form ve ekran üzerindeki deneme uyarısı gerçek transfer yapılmadığını ayrıca açıklar. Veritabanı PENDING değeri arayüzde Beklemede olarak gösterilir. Listede yalnızca IBAN'ın son dört hanesi görünür.

## Erişim
Her iki tabloda RLS etkindir. Kullanıcılar yalnızca kendi satırlarını okuyabilir; doğrudan ekleme/güncelleme/silme izni yoktur. Değişiklikler doğrulanmış RPC üzerinden yapılır. Oturumsuz RPC çağrıları engellenir. İşlevler ve yeni tablolar OnSpace Cloud'a SQL aracılığıyla oluşturulmuştur. Gerçek ödemeler için bu deneme akışından ayrı, doğrulanmış sensör ve reklam kayıtlarına bağlı finansal defter gerekir.
