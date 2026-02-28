"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns"
import { tr } from "date-fns/locale/tr"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Event } from "@/types"

const DAY_NAMES = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]

const CATEGORY_DOT_COLORS: Record<Event["category"], string> = {
  corba: "bg-yey-red",
  iftar: "bg-yey-turquoise",
  eglence: "bg-yey-yellow",
  diger: "bg-yey-blue",
}

type CalendarViewProps = {
  events: Event[]
  onDateSelect: (date: Date) => void
  selectedDate: Date | null
}

export function CalendarView({ events, onDateSelect, selectedDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [direction, setDirection] = useState(0)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const goToPreviousMonth = useCallback(() => {
    setDirection(-1)
    setCurrentMonth((prev) => subMonths(prev, 1))
  }, [])

  const goToNextMonth = useCallback(() => {
    setDirection(1)
    setCurrentMonth((prev) => addMonths(prev, 1))
  }, [])

  const goToToday = useCallback(() => {
    const today = new Date()
    setDirection(today > currentMonth ? 1 : -1)
    setCurrentMonth(today)
    onDateSelect(today)
  }, [currentMonth, onDateSelect])

  const getEventsForDay = useCallback(
    (day: Date) =>
      events.filter((e) => isSameDay(new Date(e.event_date), day)),
    [events]
  )

  const monthKey = format(currentMonth, "yyyy-MM")

  return (
    <div className="yey-card overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="rounded-lg p-2 text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground">
            {format(currentMonth, "MMMM yyyy", { locale: tr })}
          </h2>
          <button
            onClick={goToToday}
            className="rounded-md bg-yey-turquoise/10 px-3 py-1 text-xs font-medium text-yey-turquoise transition-colors hover:bg-yey-turquoise/20"
          >
            Bugün
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          className="rounded-lg p-2 text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day names */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAY_NAMES.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-foreground/50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={monthKey}
          initial={{ x: direction * 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -60, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="grid grid-cols-7 gap-1"
        >
          {days.map((day) => {
            const dayEvents = getEventsForDay(day)
            const inCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const today = isToday(day)
            const uniqueCategories = [
              ...new Set(dayEvents.map((e) => e.category)),
            ] as Event["category"][]

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "group relative flex aspect-square flex-col items-center justify-center rounded-lg transition-all duration-200",
                  inCurrentMonth
                    ? "text-foreground hover:bg-foreground/5"
                    : "text-foreground/25",
                  today && !isSelected && "ring-2 ring-yey-turquoise/60",
                  isSelected && "bg-yey-yellow text-yey-dark-bg shadow-lg shadow-yey-yellow/20"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium",
                    isSelected && "font-bold",
                    today && !isSelected && "font-bold text-yey-turquoise"
                  )}
                >
                  {format(day, "d")}
                </span>

                {uniqueCategories.length > 0 && (
                  <div className="mt-0.5 flex gap-0.5">
                    {uniqueCategories.slice(0, 4).map((cat) => (
                      <span
                        key={cat}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-125",
                          isSelected ? "bg-yey-dark-bg/60" : CATEGORY_DOT_COLORS[cat]
                        )}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
