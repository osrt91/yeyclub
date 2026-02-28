import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/helpers";
import { MOCK_NOTIFICATIONS } from "@/lib/data/mock-data";
import { logger } from "@/lib/logger";
import type { Notification } from "@/types";

export async function getUserNotifications(
  userId: string
): Promise<Notification[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_NOTIFICATIONS.filter((n) => n.user_id === userId || userId === "u1");
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Failed to fetch notifications", error);
      return [];
    }
    return (data as Notification[]) ?? [];
  } catch (error) {
    logger.error("Notifications query failed", error);
    return [];
  }
}

export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  if (!isSupabaseConfigured()) {
    return MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
  }

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) {
      logger.error("Failed to fetch unread count", error);
      return 0;
    }
    return count ?? 0;
  } catch (error) {
    logger.error("Unread count query failed", error);
    return 0;
  }
}

export async function getRecentNotifications(
  limit = 10
): Promise<Notification[]> {
  if (!isSupabaseConfigured()) return MOCK_NOTIFICATIONS.slice(0, limit);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      logger.error("Failed to fetch recent notifications", error);
      return MOCK_NOTIFICATIONS.slice(0, limit);
    }
    return (data as Notification[]) ?? [];
  } catch (error) {
    logger.error("Recent notifications query failed", error);
    return [];
  }
}
