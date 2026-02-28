"use client"

import { cn } from "@/lib/utils"
import { Calendar, UserCheck, Info, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale/tr"
import { motion } from "framer-motion"
import type { Notification } from "@/types"

type NotificationItemProps = {
  notification: Notification
  onMarkRead: (id: string) => void
}

const TYPE_CONFIG = {
  event: { icon: Calendar, color: "text-yey-turquoise", bg: "bg-yey-turquoise/10" },
  rsvp: { icon: UserCheck, color: "text-yey-yellow", bg: "bg-yey-yellow/10" },
  system: { icon: Info, color: "text-yey-blue", bg: "bg-yey-blue/10" },
  blog: { icon: FileText, color: "text-yey-red", bg: "bg-yey-red/10" },
} as const

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const config = TYPE_CONFIG[notification.type]
  const Icon = config.icon
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: tr,
  })

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onClick={() => onMarkRead(notification.id)}
      className={cn(
        "flex w-full items-start gap-4 rounded-xl p-4 text-left transition-all duration-200",
        "hover:bg-foreground/5",
        !notification.read && "bg-yey-yellow/5 border border-yey-yellow/20"
      )}
    >
      <div className={cn("mt-0.5 shrink-0 rounded-lg p-2.5", config.bg)}>
        <Icon className={cn("h-5 w-5", config.color)} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm text-foreground",
            !notification.read ? "font-semibold" : "font-medium opacity-80"
          )}
        >
          {notification.title}
        </p>
        <p className="mt-0.5 truncate text-sm text-foreground/60">{notification.message}</p>
        <p className="mt-1.5 text-xs text-foreground/40">{timeAgo}</p>
      </div>

      {!notification.read && (
        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-yey-yellow" />
      )}
    </motion.button>
  )
}
