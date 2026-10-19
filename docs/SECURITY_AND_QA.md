# Güvenlik sınırı ve doğrulama listesi

## Uygulanan sınırlar
- Gerçek e-posta oturumu ve kullanıcıya özel bulut verileri kullanılır.
- Mobil uygulamada yalnızca üç kullanıcı sekmesi vardır; ayrıcalıklı karar veya rol değiştirme iş akışı bulunmaz.
- payout_requests ve walk_demo_states için kullanıcıya özel SELECT politikaları vardır; doğrudan istemci yazması engellenir.
- walk_demo_action yalnızca authenticated rolüne açıktır. İstemciden kullanıcı kimliği alınmaz; auth.uid() kullanılır.
- Talep ve bakiye kesintisi aynı işlemde, durum satırı kilitlenerek gerçekleşir.
- Talep kimliği benzersizdir. Başarı yanıtı kaybolursa yeniden deneme aynı kimliği kullanır.
- IBAN doğrulaması hem istemcide hem sunucuda MOD-97 kontrolü yapar. Tam IBAN yalnızca kullanıcıya özel sunucu verilerinde bulunur; listede son dört hane gösterilir. Finansal bilgiler ve tokenlar loglara yazılmaz.
- Kullanıcı değişiminde paylaşılan durum sıfırlanır. Eski oturumun geç gelen yanıtı yeni hesabın durumuna uygulanmaz.
- Hata halinde başarı gösterilmez ve istemci bakiyesi iyimser biçimde azaltılmaz.

## Deneme ile gerçek kazanç ayrımı
Tüm kayıtlar is_demo=true ile oluşturulur. Bakiye örnektir; sensör ve reklam doğrulaması gerçek değildir. Bu akış ödeme talebi verilerini saklar ancak banka transferi yapmaz. Deneme verileri hiçbir gerçek ödeme işleyicisine aktarılmamalıdır. Gerçek para için doğrulanmış sensör kayıtları, sunucu tarafında reklam doğrulaması, değiştirilemez finansal defter, mevzuat ve veri saklama gereksinimleri ayrıca uygulanmalıdır.

## Yapılan veritabanı kontrolleri
- RLS: iki tabloda yalnızca kullanıcıya özel authenticated SELECT politikaları doğrulandı.
- RPC: anonymous_execute=false; authenticated_execute=true.
- Doğrudan istemci ekleme/güncelleme: false.
- TR330006100519786457841326 geçerli, son hanesi 7 yapılan örnek geçersiz olarak doğrulandı.
Bu kontroller cihaz veya uçtan uca uygulama testi yerine geçmez.

## Manuel test senaryoları
1. Yeni e-posta, en az 6 karakterli şifre ve eşleşen şifre tekrarıyla kod iste; 4 haneli kodu doğrula. Eksik, hatalı ve süresi dolmuş kodlarda Türkçe hata bekle.
2. Girişten sonra yalnızca Bugün, Cüzdan ve Aktivite görünmeli. Çıkış Yap işlemi giriş ekranına dönmeli.
3. İlk örnek hesabın 6.842 adımından 2.000'i dönüştürülmüştür. Kalan 4.842 adım 48,42 jeton verir; ek adım olmadan ikinci dönüşüm bakiye eklemez.
4. 1.000 adım/500 saniye kabul edilmeli; 200 adım/10 saniye reddedilmeli. Günlük toplam 15.000'i aşmamalı.
5. 30 saniyelik örnek reklam tamamlanınca sonraki dönüşüm 2x olmalı. İptal ve reklam hatasında bonus verilmemeli.
6. Hatalı IBAN, eksik banka, kısa ad soyad, 50,00 TL altı, üç ondalık basamak ve yetersiz bakiyede talep eklenmemeli.
7. Geçerli 50,00 TL deneme talebinde payout_requests satırı PENDING, is_demo=true ve oturum sahibinin user_id değeriyle oluşmalı. 1.000 jeton atomik olarak düşmeli.
8. Başarı mesajı istenen Türkçe metinle ve Tamam düğmesiyle görünmeli. Listede Beklemede ve maskelenmiş IBAN yer almalı.
9. Gönder düğmesine hızlı tekrar basma, bağlantı kesilmesi ve aynı kimlikle yeniden deneme çift talep oluşturmamalı.
10. Farklı hesap, başka kullanıcının talebini okuyamamalı. Oturumsuz çağrı ve doğrudan ekleme/güncelleme reddedilmeli.
11. Yeniden açılışta sunucudaki bakiye/talep korunmalı. Sunucuya ulaşılamazsa Türkçe hata ve Yeniden Dene gösterilmeli.
12. Türkiye saatiyle gece yarısında günlük adımlar ve 2x hakları sıfırlanmalı; bakiye ve talepler korunmalı.
13. 320 piksel telefon, tablet ve yatay kullanımda alt sekmeler, kaydırılan banka seçimleri, güvenli alanlar ve klavye erişimi kontrol edilmeli.

Otomatik derleme, uçtan uca oturum, gerçek e-posta teslimi ve cihaz testleri bu düzenleme ortamında çalıştırılmadı.
