"use client"

import { Search, X } from "lucide-react"
import { EVENT_CATEGORIES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Event } from "@/types"

const STATUS_OPTIONS: { value: Event["status"] | "all"; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "upcoming", label: "Yaklaşan" },
  { value: "ongoing", label: "Devam Eden" },
  { value: "completed", label: "Tamamlanan" },
]

type EventFilterProps = {
  searchQuery: string
  selectedCategory: string
  selectedStatus: string
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onStatusChange: (status: string) => void
}

export function EventFilter({
  searchQuery,
  selectedCategory,
  selectedStatus,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: EventFilterProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
        <input
          type="text"
          placeholder="Etkinlik ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "w-full rounded-xl border border-border bg-card py-3 pl-12 pr-10",
            "text-foreground placeholder:text-foreground/40",
            "backdrop-blur-sm transition-all duration-200",
            "focus:border-yey-yellow/50 focus:outline-none focus:ring-2 focus:ring-yey-yellow/20"
          )}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-foreground/40 hover:bg-foreground/10 hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
            selectedCategory === "all"
              ? "bg-yey-yellow text-yey-dark-bg shadow-md shadow-yey-yellow/20"
              : "border border-border text-foreground/70 hover:border-yey-yellow/30 hover:text-yey-yellow"
          )}
        >
          Tümü
        </button>
        {EVENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              selectedCategory === cat.id
                ? "bg-yey-yellow text-yey-dark-bg shadow-md shadow-yey-yellow/20"
                : "border border-border text-foreground/70 hover:border-yey-yellow/30 hover:text-yey-yellow"
            )}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onStatusChange(opt.value)}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
              selectedStatus === opt.value
                ? "bg-yey-turquoise text-white shadow-sm"
                : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
