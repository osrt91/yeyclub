import type { Metadata } from "next";
import { getEvents, getRsvpCounts } from "@/lib/queries/events";
import { EventsPageContent } from "@/components/events/EventsPageContent";

export const metadata: Metadata = {
  title: "Etkinlikler – YeyClub",
  description: "YeyClub topluluk etkinliklerini keşfet ve katıl!",
};

export default async function EtkinliklerPage() {
  const [events, rsvpCounts] = await Promise.all([
    getEvents(),
    getRsvpCounts(),
  ]);

  return (
    <div className="yey-container py-12">
      <div className="mb-10">
        <h1 className="yey-heading mb-3 text-4xl">Etkinlikler</h1>
        <p className="yey-text-muted text-lg">
          Topluluk etkinliklerini keşfet ve katıl!
        </p>
      </div>

      <EventsPageContent events={events} rsvpCounts={rsvpCounts} />
    </div>
  );
}
