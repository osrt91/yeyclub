import type { Metadata } from "next";
import { Bell, Send, Calendar, Settings, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Bildirim Gönderimi | YeyClub Admin",
  description: "YeyClub üyelerine bildirim gönderin.",
};

const recentNotifications = [
  {
    title: "Mart Etkinlik Takvimi Yayında",
    type: "event",
    target: "Tüm Üyeler",
    date: "26 Şub 2026",
    color: "text-yey-turquoise",
    bg: "bg-yey-turquoise/10",
  },
  {
    title: "Yeni Blog Yazısı: Platform Yayında",
    type: "blog",
    target: "Tüm Üyeler",
    date: "25 Şub 2026",
    color: "text-yey-blue",
    bg: "bg-yey-blue/10",
  },
  {
    title: "Sistem Bakımı Tamamlandı",
    type: "system",
    target: "Sadece Adminler",
    date: "24 Şub 2026",
    color: "text-yey-yellow",
    bg: "bg-yey-yellow/10",
  },
  {
    title: "Çorba Dağıtımı Hatırlatma",
    type: "event",
    target: "Tüm Üyeler",
    date: "20 Şub 2026",
    color: "text-yey-turquoise",
    bg: "bg-yey-turquoise/10",
  },
];

const typeIcons: Record<string, typeof Bell> = {
  event: Calendar,
  system: Settings,
  blog: FileText,
};

const inputClass =
  "w-full rounded-lg border border-foreground/10 bg-foreground/[0.03] px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-yey-turquoise focus:outline-none focus:ring-2 focus:ring-yey-turquoise/20";

export default function AdminBildirimPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="yey-heading text-3xl">Bildirim Gönderimi</h1>
        <p className="yey-text-muted mt-1">
          Üyelere bildirim gönderin ve geçmiş bildirimleri görüntüleyin.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          <div className="yey-card">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-yey-yellow/10 p-3">
                <Bell className="h-6 w-6 text-yey-yellow" />
              </div>
              <h2 className="yey-heading text-xl">Yeni Bildirim</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Başlık
                </label>
                <input
                  type="text"
                  placeholder="Bildirim başlığı"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Mesaj
                </label>
                <textarea
                  rows={4}
                  placeholder="Bildirim mesajı..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Tür
                  </label>
                  <select className={inputClass}>
                    <option value="event">Etkinlik</option>
                    <option value="system">Sistem</option>
                    <option value="blog">Blog</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Hedef
                  </label>
                  <select className={inputClass}>
                    <option value="all">Tüm Üyeler</option>
                    <option value="admins">Sadece Adminler</option>
                  </select>
                </div>
              </div>

              <button type="button" className="yey-btn-primary w-full">
                <Send className="mr-2 h-5 w-5" />
                Bildirimi Gönder
              </button>
            </div>
          </div>
        </div>

        {/* Recent */}
        <div className="lg:col-span-2">
          <div className="yey-card">
            <h2 className="yey-heading mb-4 text-lg">Son Gönderilen</h2>
            <div className="space-y-4">
              {recentNotifications.map((n) => {
                const Icon = typeIcons[n.type] ?? Bell;
                return (
                  <div
                    key={n.title}
                    className="flex items-start gap-3 rounded-lg border border-foreground/5 p-3"
                  >
                    <div className={`flex-shrink-0 rounded-lg ${n.bg} p-2`}>
                      <Icon className={`h-4 w-4 ${n.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {n.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-foreground/50">
                        <span>{n.target}</span>
                        <span>·</span>
                        <span>{n.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
