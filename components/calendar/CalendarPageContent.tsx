"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Calendar } from "lucide-react";
import { isSameDay } from "date-fns";
import { CalendarView } from "@/components/calendar/CalendarView";
import type { Event } from "@/types";

const DayEventsList = dynamic(
  () => import("@/components/calendar/DayEventsList").then((m) => m.DayEventsList),
  {
    ssr: false,
    loading: () => (
      <div className="yey-card flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-yey-turquoise border-t-transparent" />
      </div>
    ),
  }
);

const CATEGORY_LEGEND = [
  { color: "bg-yey-red", label: "Yardım" },
  { color: "bg-yey-turquoise", label: "İftar & Ramazan" },
  { color: "bg-yey-yellow", label: "Eğlence" },
  { color: "bg-yey-blue", label: "Sosyal Sorumluluk" },
];

type Props = {
  events: Event[];
};

export function CalendarPageContent({ events }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter((e) =>
      isSameDay(new Date(e.event_date), selectedDate)
    );
  }, [events, selectedDate]);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-4">
        {CATEGORY_LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
            <span className="text-sm text-foreground/60">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <CalendarView
          events={events}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <div>
          {selectedDate ? (
            <DayEventsList events={selectedDayEvents} date={selectedDate} />
          ) : (
            <div className="yey-card flex flex-col items-center gap-3 py-16 text-center">
              <Calendar className="h-10 w-10 text-foreground/20" />
              <p className="yey-text-muted text-sm">
                Etkinlikleri görmek için bir gün seçin
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
