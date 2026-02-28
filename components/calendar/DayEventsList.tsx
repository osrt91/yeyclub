"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { tr } from "date-fns/locale/tr"
import { Clock, MapPin, CalendarX } from "lucide-react"
import { cn } from "@/lib/utils"
import { EVENT_CATEGORIES } from "@/lib/constants"
import type { Event } from "@/types"

const CATEGORY_BADGE: Record<Event["category"], string> = {
  corba: "bg-yey-red/15 text-yey-red",
  iftar: "bg-yey-turquoise/15 text-yey-turquoise",
  eglence: "bg-yey-yellow/15 text-yey-yellow",
  diger: "bg-yey-blue/15 text-yey-blue",
}

type DayEventsListProps = {
  events: Event[]
  date: Date
}

export function DayEventsList({ events, date }: DayEventsListProps) {
  const dayLabel = format(date, "d MMMM yyyy, EEEE", { locale: tr })

  return (
    <div className="yey-card">
      <h3 className="mb-4 text-lg font-bold text-foreground">{dayLabel}</h3>

      <AnimatePresence mode="wait">
        {events.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-3 py-10 text-center"
          >
            <CalendarX className="h-10 w-10 text-foreground/20" />
            <p className="yey-text-muted text-sm">
              Bu günde etkinlik bulunmuyor
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={date.toISOString()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {events.map((event, i) => {
              const cat = EVENT_CATEGORIES.find((c) => c.id === event.category)

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={`/etkinlikler/${event.slug}`}
                    className={cn(
                      "block rounded-lg border border-border bg-accent p-4",
                      "transition-all duration-200 hover:border-yey-turquoise/30 hover:bg-accent/80"
                    )}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-foreground">
                        {event.title}
                      </h4>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          CATEGORY_BADGE[event.category]
                        )}
                      >
                        {cat?.icon} {cat?.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/60">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {format(new Date(event.event_date), "HH:mm", { locale: tr })}
                      </span>
                      {event.location_name && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {event.location_name}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
