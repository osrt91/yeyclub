import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale/tr";
import { cn } from "@/lib/utils";
import { getUpcomingEvents, getRsvpCounts } from "@/lib/queries/events";
import { EVENT_CATEGORIES } from "@/lib/constants";

const CATEGORY_GRADIENTS: Record<string, string> = {
  corba: "from-yey-red/30 to-yey-yellow/20",
  iftar: "from-yey-yellow/30 to-yey-turquoise/20",
  eglence: "from-yey-turquoise/30 to-yey-blue/20",
  diger: "from-yey-blue/30 to-yey-ice-blue/20",
};

const CATEGORY_COLORS: Record<string, string> = {
  corba: "bg-yey-red/20 text-yey-red",
  iftar: "bg-yey-yellow/20 text-yey-yellow",
  eglence: "bg-yey-turquoise/20 text-yey-turquoise",
  diger: "bg-yey-blue/20 text-yey-blue",
};

export async function UpcomingEventsSection() {
  const [events, counts] = await Promise.all([
    getUpcomingEvents(3),
    getRsvpCounts(),
  ]);

  if (events.length === 0) return null;

  return (
    <section className="py-14">
      <div className="yey-container">
        <div className="mb-12 text-center">
          <h2 className="yey-heading mb-4 text-3xl sm:text-4xl">
            Yaklaşan Etkinlikler
          </h2>
          <p className="yey-text-muted mx-auto max-w-2xl text-lg">
            Takvimimizdeki en yakın etkinliklere göz at, yerini ayırt.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const category = EVENT_CATEGORIES.find(
              (c) => c.id === event.category
            );
            const rsvpCount = counts[event.id] ?? 0;
            const formattedDate = format(
              new Date(event.event_date),
              "d MMMM yyyy",
              { locale: tr }
            );

            return (
              <Link
                key={event.id}
                href={`/etkinlikler/${event.slug}`}
                className="yey-card group overflow-hidden p-0 hover:scale-[1.02] hover:shadow-xl"
              >
                <div
                  className={cn(
                    "flex h-48 items-end bg-gradient-to-br p-5",
                    CATEGORY_GRADIENTS[event.category] ??
                      CATEGORY_GRADIENTS.diger
                  )}
                >
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      CATEGORY_COLORS[event.category] ??
                        CATEGORY_COLORS.diger
                    )}
                  >
                    {category?.label ?? "Diğer"}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="mb-3 text-lg font-semibold text-foreground transition-colors group-hover:text-yey-turquoise">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-foreground/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-yey-yellow" />
                      {formattedDate}
                    </div>
                    {event.location_name && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-yey-turquoise" />
                        {event.location_name}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-yey-blue" />
                      {rsvpCount} katılımcı
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/etkinlikler"
            className="group inline-flex items-center gap-2 font-medium text-yey-turquoise transition-colors hover:text-yey-turquoise/80"
          >
            Tüm Etkinlikleri Gör
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
