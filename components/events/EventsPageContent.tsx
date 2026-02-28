"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarOff } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { EventFilter } from "@/components/events/EventFilter";
import type { Event } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

type Props = {
  events: Event[];
  rsvpCounts: Record<string, number>;
};

export function EventsPageContent({ events, rsvpCounts }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        !searchQuery ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || event.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [events, searchQuery, selectedCategory, selectedStatus]);

  return (
    <>
      <div className="mb-8">
        <EventFilter
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
        />
      </div>

      {filteredEvents.length > 0 ? (
        <motion.div
          key={`${selectedCategory}-${selectedStatus}-${searchQuery}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredEvents.map((event) => (
            <motion.div key={event.id} variants={itemVariants}>
              <EventCard
                event={event}
                rsvpCount={rsvpCounts[event.id]}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CalendarOff className="mb-4 h-16 w-16 text-foreground/20" />
          <h3 className="mb-2 text-xl font-semibold text-foreground/60">
            Etkinlik bulunamadı
          </h3>
          <p className="yey-text-muted max-w-md">
            Arama kriterlerinize uygun etkinlik bulunamadı. Filtreleri
            değiştirerek tekrar deneyin.
          </p>
        </div>
      )}
    </>
  );
}
