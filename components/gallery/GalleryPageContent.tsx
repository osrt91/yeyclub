"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";
import { GalleryGrid, Lightbox, GalleryFilter } from "@/components/gallery";
import type { GalleryItem } from "@/types";

type GalleryEvent = { id: string; title: string };

type Props = {
  items: GalleryItem[];
  events: GalleryEvent[];
};

export function GalleryPageContent({ items, events }: Props) {
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedEvent !== "all" && item.event_id !== selectedEvent)
        return false;
      if (selectedType !== "all" && item.media_type !== selectedType)
        return false;
      return true;
    });
  }, [items, selectedEvent, selectedType]);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === 0 ? filteredItems.length - 1 : lightboxIndex - 1
    );
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === filteredItems.length - 1 ? 0 : lightboxIndex + 1
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-8"
      >
        <GalleryFilter
          events={events}
          selectedEvent={selectedEvent}
          selectedType={selectedType}
          onEventChange={setSelectedEvent}
          onTypeChange={setSelectedType}
        />
      </motion.div>

      {filteredItems.length > 0 ? (
        <GalleryGrid
          items={filteredItems}
          onItemClick={(index) => setLightboxIndex(index)}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="mb-4 rounded-full bg-foreground/5 p-4">
            <ImageOff className="h-10 w-10 text-foreground/30" />
          </div>
          <p className="text-lg font-medium text-foreground/60">
            Bu filtreye uygun içerik bulunamadı
          </p>
          <p className="mt-1 text-sm text-foreground/40">
            Farklı bir filtre deneyin
          </p>
        </motion.div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}
