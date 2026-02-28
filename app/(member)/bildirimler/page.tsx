"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { MOCK_NOTIFICATIONS } from "@/lib/data/mock-data";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/actions/notifications";
import type { Notification } from "@/types";

type FilterTab = "all" | "unread" | "event" | "system";

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "Tümü" },
  { id: "unread", label: "Okunmamış" },
  { id: "event", label: "Etkinlik" },
  { id: "system", label: "Sistem" },
];

export default function BildirimlerPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "event":
        return notifications.filter(
          (n) => n.type === "event" || n.type === "rsvp"
        );
      case "system":
        return notifications.filter(
          (n) => n.type === "system" || n.type === "blog"
        );
      default:
        return notifications;
    }
  }, [notifications, activeFilter]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await markNotificationAsRead(id);
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsAsRead();
  };

  return (
    <div className="yey-container py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-yey-yellow/10 p-2.5">
              <Bell className="h-6 w-6 text-yey-yellow" />
            </div>
            <div>
              <h1 className="yey-heading text-3xl">Bildirimler</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-foreground/50">
                  {unreadCount} okunmamış bildirim
                </p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
            >
              <CheckCheck className="h-4 w-4" />
              Tümünü Okundu İşaretle
            </button>
          )}
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                activeFilter === tab.id
                  ? "bg-yey-yellow text-yey-dark-bg"
                  : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
              )}
            >
              {tab.label}
              {tab.id === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yey-dark-bg/20 text-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="yey-card overflow-hidden p-2">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((notification, i) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <NotificationItem
                    notification={notification}
                    onMarkRead={handleMarkAsRead}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-16"
              >
                <div className="rounded-full bg-foreground/5 p-4">
                  <Inbox className="h-8 w-8 text-foreground/30" />
                </div>
                <p className="text-sm font-medium text-foreground/50">
                  Bildirim bulunmuyor
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
