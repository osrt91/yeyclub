# YeyClub – Kalan İşler

Bu dosya projenin tamamlanan kısımlarını ve kalan görevleri listeler. Güncelleme: Şubat 2026.

---

## Tamamlanan Fazlar

### Faz 0: Hazırlık ✅
- [x] Next.js 15+ (App Router) + TypeScript + Tailwind CSS 4 + pnpm kurulumu
- [x] shadcn/ui altyapısı (CVA, clsx, tailwind-merge), Lucide React, Framer Motion, Zustand
- [x] Design system (renk paleti, dark/light mode, utility sınıfları)
- [x] Supabase client/server/middleware konfigürasyonu
- [x] Veritabanı şeması (supabase/schema.sql): profiles, events, event_rsvps, gallery_items, blog_posts, notifications
- [x] Proje dosya yapısı (app routes, components, lib, hooks, stores, types)
- [x] Header, Footer, ThemeToggle, Logo
- [x] ESLint, next.config.ts, vercel.json, robots.txt, sitemap.xml

### Faz 1: Temel Web MVP ✅
- [x] Ana Sayfa (Hero, kategoriler, yaklaşan etkinlikler, CTA)
- [x] Auth: Giriş / Kayıt (e-posta + şifre, Google OAuth, KVKK, Zod validasyon)
- [x] OAuth callback route (/auth/callback)
- [x] Etkinlik listeleme (kartlar, filtreleme, arama)
- [x] Etkinlik detay sayfası + RSVP butonu
- [x] Admin panel layout (sidebar, navigasyon)
- [x] Admin Dashboard (istatistikler, son etkinlikler)
- [x] Admin Etkinlik Yönetimi (CRUD, EventForm)
- [x] RSVP bileşeni (Katılıyorum / Belki / Katılmıyorum)

### Faz 2: Zengin Özellikler ✅
- [x] Galeri sayfası (masonry grid, lightbox, filtreleme, lazy loading)
- [x] Etkinlik Takvimi (aylık görünüm, kategori noktaları, gün seçimi)
- [x] Üye Profili + Profil Düzenleme (avatar, bildirim tercihleri)
- [x] Bildirimler sayfası (liste, filtre, okundu işaretleme)
- [x] Hakkımızda (misyon/vizyon, hikaye, değerler, ekip)
- [x] İletişim (bilgiler + ContactForm)
- [x] Admin: Üyeler, Galeri, Blog, Bildirim, Ayarlar placeholder sayfaları

### Faz 3: Blog & İçerik ✅
- [x] Blog listeleme (arama, kategori filtreleri, featured post)
- [x] Blog detay (prose, paylaşım butonları, yazar kartı, ilgili yazılar)
- [x] Admin Blog CRUD (BlogEditor, liste/editör görünümü, yayınla/taslak)
- [x] Merkezi mock veri (lib/mock-data.ts)
- [x] PWA manifest (app/manifest.ts)
- [x] Özel 404 sayfası (app/not-found.tsx)
- [x] Prose CSS stilleri (blog içerik)

### Faz 3.5: Backend & Supabase Entegrasyonu ✅
- [x] Zod schemas (lib/schemas.ts) + types z.infer ile türetildi
- [x] ActionError, withActionHandler, logger, sanitize, validate altyapısı
- [x] Auth guard (requireAuth, requireAdmin, requireOwnership, getOptionalAuth)
- [x] Data query fonksiyonları (events, blog, gallery, notifications, profiles) + mock fallback
- [x] Server actions (event CRUD, blog CRUD, gallery, notification, profile mutations)
- [x] 21 sayfa mock veriden Supabase sorgularına migre edildi
- [x] Server Component + Client Content wrapper pattern (etkinlikler, blog, galeri, takvim)
- [x] UpcomingEventsSection async server component olarak güncellendi
- [x] Admin sayfaları gerçek veri ve server action'larla bağlandı
- [x] Middleware auth guard: /profil, /bildirimler, /admin koruması
- [x] blog_posts tablosuna category kolonu eklendi
- [x] Merkezi mock data (lib/data/mock-data.ts) oluşturuldu

---

## Kalan İşler

### Faz 4: Mobil Uygulama
- [ ] Expo proje kurulumu (React Native + Expo SDK)
- [ ] Navigasyon (Expo Router)
- [ ] Supabase entegrasyonu (mobil client)
- [ ] Temel ekranlar: Ana sayfa, Etkinlikler, Etkinlik detay, Galeri, Profil
- [ ] Push bildirim (Expo Notifications, FCM + APNs)
- [ ] EAS Build + Google Play / App Store yayını

### Vercel Deployment ✅
- [x] Vercel CLI ile proje oluşturma ve bağlama (yeyclub-team/yeyclub)
- [x] Environment variables tanımlama (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- [x] Production deploy (https://yeyclub.vercel.app)
- [x] Build başarılı: 24 rota (8 statik, 16 dinamik), Frankfurt region, güvenlik başlıkları aktif

### Faz 5: Optimizasyon & Büyüme
- [x] Vercel Analytics + Speed Insights entegrasyonu (@vercel/analytics, @vercel/speed-insights)
- [x] Core Web Vitals optimizasyonu (content-visibility, lazy loading, image formats)
- [x] Görsel optimizasyonu (7 raw img → Next/Image, avif/webp, responsive sizes, priority LCP)
- [x] Lightbox lazy loading (next/dynamic, ssr: false)
- [x] Güvenlik başlıkları (HSTS, CSP, Referrer-Policy, Permissions-Policy)
- [x] Admin rol doğrulaması (middleware'de profiles tablosu sorgusu)
- [x] CSRF koruması (Origin/Host kontrolü)
- [x] PWA ikonları (icon-192.png, icon-512.png, favicon.ico, icon.svg)
- [x] Code splitting / bundle analizi (barrel import fix, dynamic imports, @next/bundle-analyzer)
- [ ] N8N veya benzeri otomasyon (WhatsApp + e-posta zincirleri)
- [x] Supabase RLS denetimi (2 kritik, 10 yüksek fix: privilege escalation, open insert, ownership binding)
- [ ] N8N veya benzeri otomasyon (WhatsApp + e-posta zincirleri) — API key gerekli

### Supabase Deployment ✅
- [x] Supabase projesi oluşturma (Dashboard)
- [x] .env.local doldurma (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- [x] schema.sql'i veritabanında çalıştırma (6 tablo, 21 RLS politikası, 4 trigger, indexler)
- [x] Auth trigger test edildi (on_auth_user_created aktif)

### Entegrasyonlar
- [ ] WhatsApp Business API / Twilio (etkinlik duyurusu, RSVP bildirimi) — API key gerekli
- [ ] Resend veya benzeri e-posta (davetiye, doğrulama) — API key gerekli
- [x] Leaflet harita (etkinlik detay, OpenStreetMap, react-leaflet, dynamic import)
- [x] Instagram / YouTube embed (SocialEmbed komponenti, Hakkımızda sayfası)

### İyileştirmeler (Opsiyonel)
- [x] public/icon-192.png ve icon-512.png (PWA ikonları)
- [x] Placeholder kapak görselleri (5 SVG: corba, iftar, eglence, default, blog)
- [x] Etkinlik CRUD'da Supabase Storage ile kapak yükleme (ImageUpload, event-covers/blog-covers bucket)
- [x] Blog içerik: Tiptap zengin editör (bold, italic, h2/h3, listeler, link, image, blockquote, code)
- [x] Rol tabanlı erişim: /admin ve /profil rotalarında auth kontrolü
- [x] Rate limiting (login: 5/15dk, kayıt: 3/saat, iletişim: 3/saat) + Cloudflare Turnstile CAPTCHA
- [ ] Çoklu dil (i18n) – planda sadece Türkçe

---

## Hızlı Başlangıç

```bash
# Bağımlılıklar
pnpm install

# Geliştirme
pnpm dev          # http://localhost:3000

# Production build
pnpm build
pnpm start
```

Supabase kullanmak için:
1. [Supabase](https://supabase.com) projesi oluştur.
2. `.env.local.example` dosyasını `.env.local` olarak kopyala ve değerleri doldur.
3. `supabase/schema.sql` dosyasını Supabase SQL Editor'da çalıştır.

---

## Notlar

- Supabase env yokken tüm sayfalar otomatik olarak mock veriye fallback yapar (geliştirme modu).
- Middleware, env yoksa session güncellemeden geçer; production'da mutlaka env tanımlı olmalı.
- Auth sayfaları Supabase env yokken placeholder URL/key ile çalışır.
- Tüm server actions withActionHandler ile sarılı, ActionError ile hata yönetimi yapılır.
- Types, Zod schemas'dan z.infer ile türetilir (types/index.ts).
