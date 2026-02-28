import type { Metadata } from "next";
import { ImageIcon, Upload, Trash2, Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "Galeri Yönetimi | YeyClub Admin",
  description: "YeyClub galeri içeriklerini yönetin.",
};

const events = [
  "Tümü",
  "Yardım Organizasyonu",
  "İftar & Ramazan",
  "Piknik",
  "Sosyal Sorumluluk",
];

const galleryItems = [
  { id: 1, title: "Gıda Yardımı - Ocak 2025", event: "Yardım Organizasyonu" },
  { id: 2, title: "İftar Buluşması 2025", event: "İftar & Ramazan" },
  { id: 3, title: "Bahar Pikniği", event: "Piknik" },
  { id: 4, title: "Gönüllü Oryantasyonu", event: "Sosyal Sorumluluk" },
  { id: 5, title: "Kış Yardımı 2024", event: "Yardım Organizasyonu" },
  { id: 6, title: "Tanışma Etkinliği", event: "Sosyal Sorumluluk" },
];

const gradients = [
  "from-yey-yellow/30 to-yey-red/30",
  "from-yey-turquoise/30 to-yey-blue/30",
  "from-yey-blue/30 to-yey-turquoise/30",
  "from-yey-red/30 to-yey-yellow/30",
  "from-yey-yellow/30 to-yey-turquoise/30",
  "from-yey-blue/30 to-yey-red/30",
];

export default function AdminGaleriPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="yey-heading text-3xl">Galeri Yönetimi</h1>
          <p className="yey-text-muted mt-1">
            Fotoğraf ve videoları yükleyin, düzenleyin.
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="yey-card border-2 border-dashed border-yey-turquoise/30">
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="rounded-2xl bg-yey-turquoise/10 p-5">
            <Upload className="h-10 w-10 text-yey-turquoise" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">
              Dosyaları sürükleyip bırakın
            </p>
            <p className="yey-text-muted mt-1 text-sm">
              veya bilgisayarınızdan seçin (PNG, JPG, WEBP — maks. 5MB)
            </p>
          </div>
          <button type="button" className="yey-btn-secondary text-sm">
            Dosya Seç
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-5 w-5 text-foreground/40" />
        <div className="flex flex-wrap gap-2">
          {events.map((e, i) => (
            <button
              key={e}
              type="button"
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-yey-turquoise text-white"
                  : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item, i) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-xl border border-border"
          >
            <div
              className={`flex aspect-video items-center justify-center bg-gradient-to-br ${gradients[i % gradients.length]}`}
            >
              <ImageIcon className="h-12 w-12 text-foreground/20" />
            </div>
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex w-full items-end justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-white/60">{item.event}</p>
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-yey-red/80 p-2 text-white transition-colors hover:bg-yey-red"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
