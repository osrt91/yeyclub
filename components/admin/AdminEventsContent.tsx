"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Filter,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { deleteEvent } from "@/lib/actions/events";
import type { EventWithCount } from "@/types";

const categoryLabels: Record<string, string> = {
  corba: "Çorba",
  iftar: "İftar",
  eglence: "Eğlence",
  diger: "Diğer",
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

type Props = {
  initialEvents: EventWithCount[];
};

export function AdminEventsContent({ initialEvents }: Props) {
  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch = e.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || e.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || e.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [events, search, categoryFilter, statusFilter]);

  async function handleDelete(id: string) {
    const event = events.find((e) => e.id === id);
    if (!event) return;
    const confirmed = window.confirm(
      `"${event.title}" etkinliğini silmek istediğinize emin misiniz?`
    );
    if (!confirmed) return;

    const result = await deleteEvent(id);
    if (result.success) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Etkinlik silindi");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="yey-heading text-3xl">Etkinlik Yönetimi</h1>
        <button type="button" className="yey-btn-primary text-sm">
          <Plus className="mr-2 h-4 w-4" />
          Yeni Etkinlik Ekle
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-foreground/10 bg-background/80 p-4 backdrop-blur-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="Etkinlik ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-foreground/20 bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/40 transition-colors focus:border-yey-turquoise focus:outline-none focus:ring-1 focus:ring-yey-turquoise"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-foreground/20 bg-background py-2.5 pl-10 pr-8 text-sm text-foreground transition-colors focus:border-yey-turquoise focus:outline-none focus:ring-1 focus:ring-yey-turquoise"
            >
              <option value="all">Tüm Kategoriler</option>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-foreground/20 bg-background py-2.5 pl-10 pr-8 text-sm text-foreground transition-colors focus:border-yey-turquoise focus:outline-none focus:ring-1 focus:ring-yey-turquoise"
            >
              <option value="all">Tüm Durumlar</option>
              {Object.entries(statusConfig).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-foreground/10 bg-background/80 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/10 text-left">
                <th className="px-6 py-3 font-medium text-foreground/60">
                  Kapak
                </th>
                <th className="px-6 py-3 font-medium text-foreground/60">
                  Başlık
                </th>
                <th className="px-6 py-3 font-medium text-foreground/60">
                  Kategori
                </th>
                <th className="px-6 py-3 font-medium text-foreground/60">
                  Tarih
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
            <tbody className="divide-y divide-foreground/5">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-foreground/50"
                  >
                    Etkinlik bulunamadı
                  </td>
                </tr>
              ) : (
                filtered.map((event) => {
                  const status = statusConfig[event.status];
                  return (
                    <tr
                      key={event.id}
                      className="transition-colors hover:bg-foreground/5"
                    >
                      <td className="px-6 py-4">
                        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-foreground/5">
                          <Calendar className="h-4 w-4 text-foreground/30" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">
                          {event.title}
                        </p>
                        <p className="mt-0.5 text-xs text-foreground/50">
                          {event.location_name}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-foreground/70">
                        {categoryLabels[event.category] ?? event.category}
                      </td>
                      <td className="px-6 py-4 text-foreground/70">
                        {new Date(event.event_date).toLocaleDateString(
                          "tr-TR",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                            status?.className ?? ""
                          )}
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
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="rounded-lg p-1.5 text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-yey-yellow"
                            aria-label="Düzenle"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(event.id)}
                            className="rounded-lg p-1.5 text-foreground/50 transition-colors hover:bg-yey-red/10 hover:text-yey-red"
                            aria-label="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-foreground/50">
        Toplam {filtered.length} etkinlik gösteriliyor
      </p>
    </div>
  );
}
