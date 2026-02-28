import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Plus,
  Bell,
  Eye,
  Pencil,
} from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import Link from "next/link";
import type { Metadata } from "next";
import { getAdminStats, getEventsWithCounts } from "@/lib/queries/events";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  description: "YeyClub yönetim paneli.",
};

const categoryLabels: Record<string, string> = {
  corba: "Yardım",
  iftar: "İftar & Ramazan",
  eglence: "Eğlence",
  diger: "Sosyal Sorumluluk",
};

const statusConfig: Record<string, { label: string; className: string }> = {
  upcoming: {
    label: "Yaklaşan",
    className: "bg-yey-turquoise/10 text-yey-turquoise",
  },
  ongoing: {
    label: "Devam Eden",
    className: "bg-yey-yellow/10 text-yey-yellow",
  },
  completed: {
    label: "Tamamlandı",
    className: "bg-green-500/10 text-green-500",
  },
  cancelled: {
    label: "İptal Edildi",
    className: "bg-yey-red/10 text-yey-red",
  },
};

export default async function AdminDashboardPage() {
  const [stats, eventsWithCounts] = await Promise.all([
    getAdminStats(),
    getEventsWithCounts(),
  ]);

  const recentEvents = eventsWithCounts.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="yey-heading text-3xl">Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/admin/etkinlikler" className="yey-btn-primary text-sm">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Etkinlik
          </Link>
          <Link href="/admin/bildirim" className="yey-btn-secondary text-sm">
            <Bell className="mr-2 h-4 w-4" />
            Bildirim Gönder
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Toplam Etkinlik"
          value={stats.totalEvents}
          icon={<Calendar className="h-6 w-6" />}
          color="turquoise"
          trend={`${stats.totalEvents} kayıtlı`}
        />
        <StatsCard
          title="Aktif Üye"
          value={stats.totalMembers}
          icon={<Users className="h-6 w-6" />}
          color="blue"
          trend="toplam üye"
        />
        <StatsCard
          title="Bu Ay Katılım"
          value={stats.recentRsvps}
          icon={<TrendingUp className="h-6 w-6" />}
          color="yellow"
          trend="son 30 gün"
        />
        <StatsCard
          title="Yaklaşan Etkinlik"
          value={stats.upcomingEvents}
          icon={<Clock className="h-6 w-6" />}
          color="red"
          trend="planlanmış"
        />
      </div>

      <div className="rounded-xl border border-border bg-card backdrop-blur-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="yey-heading text-lg">Son Etkinlikler</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-6 py-3 font-medium text-foreground/60">
                  Başlık
                </th>
                <th className="px-6 py-3 font-medium text-foreground/60">
                  Tarih
                </th>
                <th className="px-6 py-3 font-medium text-foreground/60">
                  Kategori
                </th>
                <th className="px-6 py-3 font-medium text-foreground/60">
                  Durum
                </th>
                <th className="px-6 py-3 font-medium text-foreground/60">
                  Katılım
                </th>
                <th className="px-6 py-3 font-medium text-foreground/60">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentEvents.map((event) => {
                const status = statusConfig[event.status];
                return (
                  <tr
                    key={event.id}
                    className="transition-colors hover:bg-foreground/5"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {event.title}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      {new Date(event.event_date).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      {categoryLabels[event.category] ?? event.category}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status?.className ?? ""}`}
                      >
                        {status?.label ?? event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground/70">
                      {event.participant_count}
                      {event.max_participants
                        ? `/${event.max_participants}`
                        : ""}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/etkinlikler/${event.slug}`}
                          className="rounded-lg p-1.5 text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-yey-turquoise"
                          aria-label="Görüntüle"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-yey-yellow"
                          aria-label="Düzenle"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
