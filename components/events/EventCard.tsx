import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale/tr"
import { cn } from "@/lib/utils"
import { EVENT_CATEGORIES } from "@/lib/constants"
import type { Event } from "@/types"

const CATEGORY_COLORS: Record<Event["category"], string> = {
  corba: "bg-yey-red text-white",
  iftar: "bg-yey-turquoise text-white",
  eglence: "bg-yey-yellow text-yey-dark-bg",
  diger: "bg-yey-blue text-white",
}

const CATEGORY_GRADIENTS: Record<Event["category"], string> = {
  corba: "from-yey-red/80 to-yey-red/40",
  iftar: "from-yey-turquoise/80 to-yey-turquoise/40",
  eglence: "from-yey-yellow/80 to-yey-yellow/40",
  diger: "from-yey-blue/80 to-yey-blue/40",
}

const STATUS_STYLES: Record<Event["status"], string> = {
  upcoming: "bg-emerald-500/20 text-emerald-400",
  ongoing: "bg-yey-yellow/20 text-yey-yellow",
  completed: "bg-foreground/10 text-foreground/50",
  cancelled: "bg-yey-red/20 text-yey-red",
}

const STATUS_LABELS: Record<Event["status"], string> = {
  upcoming: "Yaklaşan",
  ongoing: "Devam Ediyor",
  completed: "Tamamlandı",
  cancelled: "İptal",
}

type EventCardProps = {
  event: Event
  rsvpCount?: number
}

export function EventCard({ event, rsvpCount = 0 }: EventCardProps) {
  const category = EVENT_CATEGORIES.find((c) => c.id === event.category)
  const formattedDate = format(new Date(event.event_date), "d MMMM yyyy, HH:mm", { locale: tr })

  return (
    <Link href={`/etkinlikler/${event.slug}`} className="group block">
      <article
        className={cn(
          "overflow-hidden rounded-xl border border-foreground/10 bg-background/80 backdrop-blur-sm",
          "transition-all duration-300",
          "hover:scale-[1.02] hover:shadow-xl hover:shadow-yey-turquoise/10 hover:border-yey-turquoise/30"
        )}
      >
        <div className="relative h-48 overflow-hidden">
          {event.cover_image ? (
            <Image
              src={event.cover_image}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div
              className={cn(
                "flex h-full w-full items-center justify-center bg-gradient-to-br",
                CATEGORY_GRADIENTS[event.category]
              )}
            >
              <span className="text-5xl">{category?.icon}</span>
            </div>
          )}

          <div className="absolute left-3 top-3 flex gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                CATEGORY_COLORS[event.category]
              )}
            >
              {category?.icon} {category?.label}
            </span>
          </div>

          <div className="absolute right-3 top-3">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm",
                STATUS_STYLES[event.status]
              )}
            >
              {STATUS_LABELS[event.status]}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="mb-3 truncate text-lg font-bold text-foreground group-hover:text-yey-yellow transition-colors">
            {event.title}
          </h3>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Calendar className="h-4 w-4 shrink-0 text-yey-turquoise" />
              <span>{formattedDate}</span>
            </div>

            {event.location_name && (
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <MapPin className="h-4 w-4 shrink-0 text-yey-red" />
                <span className="truncate">{event.location_name}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Users className="h-4 w-4 shrink-0 text-yey-blue" />
              <span>
                {rsvpCount} katılımcı
                {event.max_participants && ` / ${event.max_participants} kişi`}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
