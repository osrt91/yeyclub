"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Edit,
  LogOut,
  CalendarCheck,
  CalendarClock,
} from "lucide-react";
import { useAuth } from "@/hooks";
import { ProfileCard } from "@/components/profile";
import { cn } from "@/lib/utils";
import { MOCK_PROFILES, MOCK_EVENTS } from "@/lib/data/mock-data";
import type { Event } from "@/types";

const CATEGORY_BADGES: Record<
  Event["category"],
  { label: string; className: string }
> = {
  corba: { label: "🍲 Çorba", className: "bg-yey-red/15 text-yey-red" },
  iftar: {
    label: "🌙 İftar",
    className: "bg-yey-turquoise/15 text-yey-turquoise",
  },
  eglence: {
    label: "🎉 Eğlence",
    className: "bg-yey-yellow/15 text-yey-yellow",
  },
  diger: { label: "📌 Diğer", className: "bg-yey-blue/15 text-yey-blue" },
};

const STATS = [
  {
    label: "Katıldığı Etkinlikler",
    value: 8,
    icon: CalendarCheck,
    color: "turquoise",
  },
  {
    label: "Yaklaşan Etkinlikler",
    value: 2,
    icon: CalendarClock,
    color: "yellow",
  },
  { label: "Toplam Saat", value: 24, icon: Clock, color: "blue" },
] as const;

const STAT_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  turquoise: {
    bg: "bg-yey-turquoise/10",
    text: "text-yey-turquoise",
    border: "border-yey-turquoise/20",
  },
  yellow: {
    bg: "bg-yey-yellow/10",
    text: "text-yey-yellow",
    border: "border-yey-yellow/20",
  },
  blue: {
    bg: "bg-yey-blue/10",
    text: "text-yey-blue",
    border: "border-yey-blue/20",
  },
};

export default function ProfilPage() {
  const router = useRouter();
  const { user, profile, signOut, isLoading } = useAuth();

  const displayProfile = profile ?? MOCK_PROFILES[0];
  const displayEmail = user?.email ?? "demo@yeyclub.com";
  const displayEvents = MOCK_EVENTS.slice(0, 5);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="yey-container py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl space-y-8"
      >
        <ProfileCard profile={displayProfile} email={displayEmail} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((stat, i) => {
            const colors = STAT_COLORS[stat.color];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
                className={cn(
                  "rounded-xl border bg-background/80 p-5 backdrop-blur-sm",
                  colors.border
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground/50">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={cn("rounded-lg p-2.5", colors.bg)}>
                    <stat.icon className={cn("h-5 w-5", colors.text)} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="yey-card p-6"
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
            <Calendar className="h-5 w-5 text-yey-turquoise" />
            Katıldığı Etkinlikler
          </h3>

          <div className="divide-y divide-foreground/5">
            {displayEvents.map((event) => {
              const badge = CATEGORY_BADGES[event.category];
              const date = new Date(event.event_date).toLocaleDateString(
                "tr-TR",
                { day: "numeric", month: "long", year: "numeric" }
              );

              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {event.title}
                    </p>
                    <p className="mt-0.5 text-xs text-foreground/50">{date}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <button
            onClick={() => router.push("/profil/duzenle")}
            className="yey-btn-primary inline-flex items-center justify-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Profili Düzenle
          </button>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="yey-btn-secondary inline-flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
