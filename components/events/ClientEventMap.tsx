"use client";

import dynamic from "next/dynamic";

const EventMap = dynamic(
  () => import("@/components/events/EventMap").then((mod) => mod.EventMap),
  { ssr: false, loading: () => <div className="h-64 sm:h-80 bg-muted animate-pulse rounded-xl" /> }
);

export function ClientEventMap({ lat, lng, locationName }: { lat: number; lng: number; locationName?: string }) {
  return <EventMap lat={lat} lng={lng} locationName={locationName} />;
}
