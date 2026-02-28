import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/helpers";
import { MOCK_PROFILES, MOCK_EVENTS } from "@/lib/data/mock-data";
import { logger } from "@/lib/logger";
import type { Profile, Event } from "@/types";

export async function getProfileById(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_PROFILES.find((p) => p.id === userId) ?? MOCK_PROFILES[0];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      logger.error("Failed to fetch profile", error);
      return null;
    }
    return data as Profile;
  } catch (error) {
    logger.error("Profile query failed", error);
    return null;
  }
}

export async function getUserAttendedEvents(
  userId: string,
  limit = 10
): Promise<Event[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_EVENTS.slice(0, limit);
  }

  try {
    const supabase = await createClient();
    const { data: rsvps, error: rsvpError } = await supabase
      .from("event_rsvps")
      .select("event_id")
      .eq("user_id", userId)
      .eq("status", "attending");

    if (rsvpError || !rsvps?.length) return [];

    const eventIds = rsvps.map((r) => r.event_id);
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .in("id", eventIds)
      .order("event_date", { ascending: false })
      .limit(limit);

    if (eventsError) {
      logger.error("Failed to fetch attended events", eventsError);
      return [];
    }
    return (events as Event[]) ?? [];
  } catch (error) {
    logger.error("Attended events query failed", error);
    return [];
  }
}

export async function getAllProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return MOCK_PROFILES;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Failed to fetch all profiles", error);
      return MOCK_PROFILES;
    }
    return (data as Profile[]) ?? [];
  } catch (error) {
    logger.error("All profiles query failed", error);
    return MOCK_PROFILES;
  }
}

export async function getMemberStats(): Promise<{
  total: number;
  admins: number;
  newThisMonth: number;
}> {
  if (!isSupabaseConfigured()) {
    return {
      total: MOCK_PROFILES.length,
      admins: MOCK_PROFILES.filter((p) => p.role === "admin").length,
      newThisMonth: 1,
    };
  }

  try {
    const supabase = await createClient();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();

    const [totalRes, adminRes, newRes] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin"),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thirtyDaysAgo),
    ]);

    return {
      total: totalRes.count ?? 0,
      admins: adminRes.count ?? 0,
      newThisMonth: newRes.count ?? 0,
    };
  } catch (error) {
    logger.error("Member stats query failed", error);
    return { total: 0, admins: 0, newThisMonth: 0 };
  }
}
