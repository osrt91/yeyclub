import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ClientEventMap } from "@/components/events/ClientEventMap";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Share2,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import { cn } from "@/lib/utils";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { RsvpButton } from "@/components/events/RsvpButton";
import {
  getEventBySlug,
  getRelatedEvents,
  getRsvpCountForEvent,
} from "@/lib/queries/events";
import type { Event } from "@/types";
import type { Metadata } from "next";

const CATEGORY_COLORS: Record<Event["category"], string> = {
  corba: "bg-yey-red text-white",
  iftar: "bg-yey-turquoise text-white",
  eglence: "bg-yey-yellow text-yey-dark-bg",
  diger: "bg-yey-blue text-white",
};

const CATEGORY_GRADIENTS: Record<Event["category"], string> = {
  corba: "from-yey-red/60 via-yey-red/30 to-transparent",
  iftar: "from-yey-turquoise/60 via-yey-turquoise/30 to-transparent",
  eglence: "from-yey-yellow/60 via-yey-yellow/30 to-transparent",
  diger: "from-yey-blue/60 via-yey-blue/30 to-transparent",
};

const STATUS_STYLES: Record<Event["status"], string> = {
  upcoming: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  ongoing: "bg-yey-yellow/20 text-yey-yellow border-yey-yellow/30",
  completed: "bg-foreground/10 text-foreground/50 border-foreground/20",
  cancelled: "bg-yey-red/20 text-yey-red border-yey-red/30",
};

const STATUS_LABELS: Record<Event["status"], string> = {
  upcoming: "Yaklaşan",
  ongoing: "Devam Ediyor",
  completed: "Tamamlandı",
  cancelled: "İptal Edildi",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    title: event ? `${event.title} – YeyClub` : "Etkinlik Bulunamadı",
    description: event?.description ?? "YeyClub etkinlik detayı.",
  };
}

export default async function EtkinlikDetayPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const [rsvpCount, relatedEvents] = await Promise.all([
    getRsvpCountForEvent(event.id),
    getRelatedEvents(event.category, event.id, 2),
  ]);

  const category = EVENT_CATEGORIES.find((c) => c.id === event.category);
  const eventDate = new Date(event.event_date);
  const formattedDate = format(eventDate, "d MMMM yyyy", { locale: tr });
  const formattedTime = format(eventDate, "HH:mm", { locale: tr });
  const formattedDay = format(eventDate, "EEEE", { locale: tr });

  return (
    <div className="min-h-screen">
      <div className="relative h-64 overflow-hidden sm:h-80 lg:h-96">
        {event.cover_image ? (
          <Image
            src={event.cover_image}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br",
              CATEGORY_GRADIENTS[event.category]
            )}
          >
            <span className="text-8xl opacity-50">{category?.icon}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="yey-container">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-semibold",
                  CATEGORY_COLORS[event.category]
                )}
              >
                {category?.icon} {category?.label}
              </span>
              <span
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-semibold",
                  STATUS_STYLES[event.status]
                )}
              >
                {STATUS_LABELS[event.status]}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="yey-container py-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-foreground/50">
          <Link href="/" className="transition-colors hover:text-yey-yellow">
            Ana Sayfa
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/etkinlikler"
            className="transition-colors hover:text-yey-yellow"
          >
            Etkinlikler
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground/80">{event.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h1 className="yey-heading mb-4 text-3xl sm:text-4xl">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-foreground/70">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-yey-turquoise" />
                  <span>
                    {formattedDate}, {formattedDay}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yey-yellow" />
                  <span>{formattedTime}</span>
                </div>
              </div>
            </div>

            {event.description && (
              <div className="rounded-xl border border-border bg-card p-6 backdrop-blur-sm">
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  Etkinlik Hakkında
                </h2>
                <p className="leading-relaxed text-foreground/80">
                  {event.description}
                </p>
              </div>
            )}

            {event.location_name && (
              <div className="rounded-xl border border-border bg-card p-6 backdrop-blur-sm">
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  Konum
                </h2>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-yey-red" />
                  <div>
                    <p className="font-medium text-foreground">
                      {event.location_name}
                    </p>
                    {event.location_lat && event.location_lng && (
                      <p className="mt-1 text-sm text-foreground/50">
                        {event.location_lat.toFixed(4)},{" "}
                        {event.location_lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
                {event.location_lat && event.location_lng && (
                  <div className="mt-4 h-64 overflow-hidden rounded-lg sm:h-80">
                    <ClientEventMap
                      lat={event.location_lat}
                      lng={event.location_lng}
                      locationName={event.location_name}
                    />
                  </div>
                )}
              </div>
            )}

            {relatedEvents.length > 0 && (
              <div>
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Benzer Etkinlikler
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedEvents.map((related) => {
                    const relCat = EVENT_CATEGORIES.find(
                      (c) => c.id === related.category
                    );
                    const relDate = format(
                      new Date(related.event_date),
                      "d MMMM yyyy",
                      { locale: tr }
                    );
                    return (
                      <Link
                        key={related.id}
                        href={`/etkinlikler/${related.slug}`}
                        className="group rounded-xl border border-border bg-card p-4 backdrop-blur-sm transition-all hover:border-yey-turquoise/30 hover:shadow-lg"
                      >
                        <span
                          className={cn(
                            "inline-block rounded-full px-3 py-1 text-xs font-semibold",
                            CATEGORY_COLORS[related.category]
                          )}
                        >
                          {relCat?.icon} {relCat?.label}
                        </span>
                        <h3 className="mt-2 font-semibold text-foreground transition-colors group-hover:text-yey-yellow">
                          {related.title}
                        </h3>
                        <p className="mt-1 text-sm text-foreground/50">
                          {relDate}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Katılım
              </h2>
              <RsvpButton
                eventId={event.id}
                maxParticipants={event.max_participants}
                currentCount={rsvpCount}
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Katılımcılar
              </h2>
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(rsvpCount, 5) }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-yey-turquoise/20 text-xs font-medium text-yey-turquoise"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                {rsvpCount > 5 && (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-accent text-xs font-medium text-foreground/60">
                    +{rsvpCount - 5}
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm text-foreground/50">
                {rsvpCount} kişi katılıyor
                {event.max_participants &&
                  ` (maks. ${event.max_participants})`}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Paylaş
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Bağlantıyı Kopyala
                  </span>
                </button>
              </div>
            </div>

            <Link
              href="/etkinlikler"
              className="flex items-center gap-2 text-sm font-medium text-foreground/60 transition-colors hover:text-yey-yellow"
            >
              <ArrowLeft className="h-4 w-4" />
              Tüm Etkinliklere Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
