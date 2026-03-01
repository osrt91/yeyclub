# YeyClub – Sonraki Oturumda Düzeltilecekler / Yapılacaklar

Bu dosya YeyClub projesi için bir sonraki oturumda düzeltmen veya tamamlaman gereken maddeleri listeler. Güncelleme: 1 Mart 2026.

---

## Proje Özeti

- **Web:** https://yeyclub.vercel.app
- **Repo:** yeyclub (GitHub)
- **Stack:** Next.js 15+, Supabase, Tailwind 4, shadcn/ui, Expo (mobile/)
- **Son durum:** Tüm kalan dosyalar commit edildi (KALAN-ISLER, mobile, vb.). Working tree temiz.

---

## Düzeltilecek / Temizlenecek

- [ ] **cursor-ide-browser, list-tools, mcp** (repo kökünde): Proje dosyası değilse `.gitignore`'a ekle ve repo’dan kaldır (veya sil). Gerekirse `git rm --cached` ile takibi bırak.

---

## Kalan İşler (KALAN-ISLER.md ile uyumlu)

### Mobil (Faz 4)
- [ ] **EAS Build + mağaza yayını:** Google Play / App Store için EAS Build çalıştırıp yayınlamak (hesap / sertifika gerekli).

### Faz 5 – Otomasyon & Entegrasyon
- [ ] **N8N veya benzeri:** WhatsApp + e-posta zincirleri (API key gerekli).
- [ ] **WhatsApp Business API / Twilio:** Etkinlik duyurusu, RSVP bildirimi (API key gerekli).
- [ ] **Resend (veya benzeri):** E-posta davetiye / doğrulama (API key gerekli).

### Opsiyonel
- [ ] **Çoklu dil (i18n):** Şu an sadece Türkçe; gerekirse i18n eklenecek.

---

## Kontrol Listesi (İsteğe Bağlı)

- [ ] `pnpm build` hatasız çalışıyor mu?
- [ ] `.env.local` ve diğer gizli dosyalar commit edilmemiş mi?
- [ ] Vercel / Supabase env değişkenleri production ile uyumlu mu?

---

*Bir sonraki oturumda bu dosyayı açıp “bunları düzelt” diyerek devam edebilirsin.*
