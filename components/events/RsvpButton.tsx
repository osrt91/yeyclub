"use client"

import { useState } from "react"
import { Check, HelpCircle, X, Users } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type RsvpStatus = "none" | "attending" | "maybe" | "declined"

type RsvpButtonProps = {
  eventId: string
  maxParticipants: number | null
  currentCount: number
}

export function RsvpButton({ eventId, maxParticipants, currentCount }: RsvpButtonProps) {
  const [status, setStatus] = useState<RsvpStatus>("none")
  const [count, setCount] = useState(currentCount)

  const isFull = maxParticipants !== null && count >= maxParticipants

  function handleRsvp(newStatus: RsvpStatus) {
    const wasAttending = status === "attending"
    const willAttend = newStatus === "attending"

    if (newStatus === status) {
      setStatus("none")
      if (wasAttending) setCount((c) => c - 1)
      toast.info("Katılım durumunuz kaldırıldı.")
      return
    }

    if (willAttend && isFull && !wasAttending) {
      toast.error("Etkinlik kapasitesi dolu!")
      return
    }

    setStatus(newStatus)

    if (willAttend && !wasAttending) {
      setCount((c) => c + 1)
    } else if (!willAttend && wasAttending) {
      setCount((c) => c - 1)
    }

    const messages: Record<Exclude<RsvpStatus, "none">, string> = {
      attending: "Katılımınız onaylandı!",
      maybe: "Belki olarak işaretlendi.",
      declined: "Katılmama durumunuz kaydedildi.",
    }
    toast.success(messages[newStatus as Exclude<RsvpStatus, "none">])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-foreground/70">
        <Users className="h-4 w-4 text-yey-blue" />
        <span>
          {count} katılımcı
          {maxParticipants && ` / ${maxParticipants} kişi`}
        </span>
      </div>

      {maxParticipants && (
        <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yey-turquoise to-yey-yellow transition-all duration-500"
            style={{ width: `${Math.min((count / maxParticipants) * 100, 100)}%` }}
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleRsvp("attending")}
          disabled={isFull && status !== "attending"}
          className={cn(
            "flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
            "disabled:cursor-not-allowed disabled:opacity-50",
            status === "attending"
              ? "bg-yey-yellow text-yey-dark-bg shadow-md shadow-yey-yellow/20"
              : "border border-foreground/10 text-foreground/70 hover:border-yey-yellow/30 hover:text-yey-yellow"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <Check className="h-4 w-4" />
            Katılıyorum
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleRsvp("maybe")}
          className={cn(
            "rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
            status === "maybe"
              ? "bg-yey-turquoise text-white shadow-md"
              : "border border-foreground/10 text-foreground/70 hover:border-yey-turquoise/30 hover:text-yey-turquoise"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Belki
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleRsvp("declined")}
          className={cn(
            "rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
            status === "declined"
              ? "bg-yey-red/80 text-white shadow-md"
              : "border border-foreground/10 text-foreground/70 hover:border-yey-red/30 hover:text-yey-red"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <X className="h-4 w-4" />
          </span>
        </button>
      </div>

      {isFull && status !== "attending" && (
        <p className="text-center text-xs text-yey-red">Etkinlik kapasitesi doldu.</p>
      )}
    </div>
  )
}
