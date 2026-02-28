import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { getEvents } from "@/lib/queries/events";
import { CalendarPageContent } from "@/components/calendar/CalendarPageContent";

export const metadata: Metadata = {
  title: "Etkinlik Takvimi – YeyClub",
  description: "Topluluk etkinliklerini takvimde görüntüle.",
};

export default async function TakvimPage() {
  const events = await getEvents();

  return (
    <div className="yey-container py-12 md:py-20">
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yey-turquoise/10">
            <Calendar className="h-5 w-5 text-yey-turquoise" />
          </div>
          <h1 className="yey-heading text-3xl md:text-4xl">
            Etkinlik Takvimi
          </h1>
        </div>
        <p className="yey-text-muted text-lg">
          Topluluk etkinliklerini takvimde görüntüle
        </p>
      </div>

      <CalendarPageContent events={events} />
    </div>
  );
}
