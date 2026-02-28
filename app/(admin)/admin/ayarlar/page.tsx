import type { Metadata } from "next";
import {
  Settings,
  Globe,
  Share2,
  Search,
  Bell,
  Save,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Site Ayarları | YeyClub Admin",
  description: "YeyClub site ayarlarını yönetin.",
};

const inputClass =
  "w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-yey-turquoise focus:outline-none focus:ring-2 focus:ring-yey-turquoise/20";

function SectionCard({
  icon: Icon,
  title,
  color,
  bg,
  children,
}: {
  icon: typeof Settings;
  title: string;
  color: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="yey-card">
      <div className="mb-6 flex items-center gap-3">
        <div className={`rounded-xl ${bg} p-3`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <h2 className="yey-heading text-xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function AdminAyarlarPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="yey-heading text-3xl">Site Ayarları</h1>
        <p className="yey-text-muted mt-1">
          Genel site ayarlarını düzenleyin.
        </p>
      </div>

      <div className="space-y-6">
        {/* Site Bilgileri */}
        <SectionCard
          icon={Globe}
          title="Site Bilgileri"
          color="text-yey-turquoise"
          bg="bg-yey-turquoise/10"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Site Adı
              </label>
              <input
                type="text"
                defaultValue="YeyClub"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Site Açıklaması
              </label>
              <textarea
                rows={3}
                defaultValue="İstanbul'un en enerjik gönüllü topluluğu"
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Site URL
              </label>
              <input
                type="url"
                defaultValue="https://yeyclub.com"
                className={inputClass}
              />
            </div>
          </div>
        </SectionCard>

        {/* Sosyal Medya */}
        <SectionCard
          icon={Share2}
          title="Sosyal Medya Linkleri"
          color="text-yey-red"
          bg="bg-yey-red/10"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Instagram
              </label>
              <input
                type="url"
                defaultValue="https://instagram.com/yeyclub"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                YouTube
              </label>
              <input
                type="url"
                defaultValue="https://youtube.com/@yeyclub"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                WhatsApp
              </label>
              <input
                type="text"
                defaultValue="+90 555 123 4567"
                className={inputClass}
              />
            </div>
          </div>
        </SectionCard>

        {/* SEO */}
        <SectionCard
          icon={Search}
          title="SEO Ayarları"
          color="text-yey-blue"
          bg="bg-yey-blue/10"
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Meta Başlık
              </label>
              <input
                type="text"
                defaultValue="YeyClub - İstanbul Gönüllü Topluluğu"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Meta Açıklama
              </label>
              <textarea
                rows={3}
                defaultValue="İstanbul'un en enerjik gönüllü topluluğu. Yardım organizasyonları, iftar buluşmaları, eğlence etkinlikleri ve daha fazlası."
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Anahtar Kelimeler
              </label>
              <input
                type="text"
                defaultValue="yeyclub, gönüllü, istanbul, topluluk, etkinlik"
                className={inputClass}
              />
            </div>
          </div>
        </SectionCard>

        {/* Bildirim Ayarları */}
        <SectionCard
          icon={Bell}
          title="Bildirim Ayarları"
          color="text-yey-yellow"
          bg="bg-yey-yellow/10"
        >
          <div className="space-y-4">
            <label className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium text-foreground">
                  E-posta Bildirimleri
                </p>
                <p className="text-sm text-foreground/50">
                  Yeni etkinliklerde üyelere e-posta gönder
                </p>
              </div>
              <div className="relative h-6 w-11 rounded-full bg-yey-turquoise">
                <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm" />
              </div>
            </label>
            <label className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium text-foreground">
                  WhatsApp Bildirimleri
                </p>
                <p className="text-sm text-foreground/50">
                  Önemli duyurularda WhatsApp mesajı gönder
                </p>
              </div>
              <div className="relative h-6 w-11 rounded-full bg-yey-turquoise">
                <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm" />
              </div>
            </label>
            <label className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium text-foreground">
                  Push Bildirimleri
                </p>
                <p className="text-sm text-foreground/50">
                  Tarayıcı push bildirimlerini etkinleştir
                </p>
              </div>
              <div className="relative h-6 w-11 rounded-full bg-foreground/20">
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm" />
              </div>
            </label>
          </div>
        </SectionCard>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button type="button" className="yey-btn-primary">
          <Save className="mr-2 h-5 w-5" />
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
}
