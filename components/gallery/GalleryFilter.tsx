"use client"

import { Camera, Film } from "lucide-react"
import { cn } from "@/lib/utils"

const MEDIA_TYPE_OPTIONS = [
  { value: "all" as const, label: "Tümü", icon: null },
  { value: "image" as const, label: "Fotoğraflar", icon: Camera },
  { value: "video" as const, label: "Videolar", icon: Film },
]

type GalleryFilterProps = {
  events: { id: string; title: string }[]
  selectedEvent: string
  selectedType: string
  onEventChange: (eventId: string) => void
  onTypeChange: (type: string) => void
}

export function GalleryFilter({
  events,
  selectedEvent,
  selectedType,
  onEventChange,
  onTypeChange,
}: GalleryFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => onEventChange("all")}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
            selectedEvent === "all"
              ? "bg-yey-yellow text-yey-dark-bg shadow-md shadow-yey-yellow/20"
              : "border border-border text-foreground/70 hover:border-yey-yellow/30 hover:text-yey-yellow"
          )}
        >
          Tüm Etkinlikler
        </button>
        {events.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => onEventChange(event.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              selectedEvent === event.id
                ? "bg-yey-yellow text-yey-dark-bg shadow-md shadow-yey-yellow/20"
                : "border border-border text-foreground/70 hover:border-yey-yellow/30 hover:text-yey-yellow"
            )}
          >
            {event.title}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MEDIA_TYPE_OPTIONS.map((opt) => {
          const Icon = opt.icon
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onTypeChange(opt.value)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
                selectedType === opt.value
                  ? "bg-yey-turquoise text-white shadow-sm"
                  : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
