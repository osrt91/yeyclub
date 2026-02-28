import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/helpers";
import { MOCK_EVENTS, MOCK_RSVP_COUNTS } from "@/lib/data/mock-data";
import { logger } from "@/lib/logger";
import type { Event, EventWithCount } from "@/types";

export async function getEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured()) return MOCK_EVENTS;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      logger.error("Failed to fetch events", error);
      return MOCK_EVENTS;
    }
    return (data as Event[]) ?? MOCK_EVENTS;
  } catch (error) {
    logger.error("Events query failed", error);
    return MOCK_EVENTS;
  }
}

export async function getUpcomingEvents(limit = 6): Promise<Event[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_EVENTS.filter((e) => e.status === "upcoming").slice(0, limit);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .in("status", ["upcoming", "ongoing"])
      .gte("event_date", new Date().toISOString())
      .order("event_date", { ascending: true })
      .limit(limit);

    if (error) {
      logger.error("Failed to fetch upcoming events", error);
      return MOCK_EVENTS.filter((e) => e.status === "upcoming").slice(0, limit);
    }
    return (data as Event[]) ?? [];
  } catch (error) {
    logger.error("Upcoming events query failed", error);
    return MOCK_EVENTS.filter((e) => e.status === "upcoming").slice(0, limit);
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_EVENTS.find((e) => e.slug === slug) ?? null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      logger.error("Failed to fetch event by slug", error);
      return MOCK_EVENTS.find((e) => e.slug === slug) ?? null;
    }
    return data as Event;
  } catch (error) {
    logger.error("Event by slug query failed", error);
    return MOCK_EVENTS.find((e) => e.slug === slug) ?? null;
  }
}

export async function getRelatedEvents(
  category: string,
  excludeId: string,
  limit = 2
): Promise<Event[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_EVENTS.filter(
      (e) => e.category === category && e.id !== excludeId
    ).slice(0, limit);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("category", category)
      .neq("id", excludeId)
      .order("event_date", { ascending: true })
      .limit(limit);

    if (error) {
      logger.error("Failed to fetch related events", error);
      return MOCK_EVENTS.filter(
        (e) => e.category === category && e.id !== excludeId
      ).slice(0, limit);
    }
    return (data as Event[]) ?? [];
  } catch (error) {
    logger.error("Related events query failed", error);
    return [];
  }
}

export async function getRsvpCounts(): Promise<Record<string, number>> {
  if (!isSupabaseConfigured()) return MOCK_RSVP_COUNTS;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("event_rsvps")
      .select("event_id")
      .eq("status", "attending");

    if (error) {
      logger.error("Failed to fetch RSVP counts", error);
      return MOCK_RSVP_COUNTS;
    }

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      counts[row.event_id] = (counts[row.event_id] ?? 0) + 1;
    }
    return counts;
  } catch (error) {
    logger.error("RSVP counts query failed", error);
    return MOCK_RSVP_COUNTS;
  }
}

export async function getRsvpCountForEvent(eventId: string): Promise<number> {
  if (!isSupabaseConfigured()) return MOCK_RSVP_COUNTS[eventId] ?? 0;

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("event_rsvps")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("status", "attending");

    if (error) {
      logger.error("Failed to fetch RSVP count", error);
      return MOCK_RSVP_COUNTS[eventId] ?? 0;
    }
    return count ?? 0;
  } catch (error) {
    logger.error("RSVP count query failed", error);
    return MOCK_RSVP_COUNTS[eventId] ?? 0;
  }
}

export async function getEventsWithCounts(): Promise<EventWithCount[]> {
  const [events, counts] = await Promise.all([getEvents(), getRsvpCounts()]);

  return events.map((event) => ({
    ...event,
    participant_count: counts[event.id] ?? 0,
  }));
}

export async function getAdminStats(): Promise<{
  totalEvents: number;
  totalMembers: number;
  recentRsvps: number;
  upcomingEvents: number;
}> {
  if (!isSupabaseConfigured()) {
    return {
      totalEvents: MOCK_EVENTS.length,
      totalMembers: 5,
      recentRsvps: Object.values(MOCK_RSVP_COUNTS).reduce((a, b) => a + b, 0),
      upcomingEvents: MOCK_EVENTS.filter((e) => e.status === "upcoming").length,
    };
  }

  try {
    const supabase = await createClient();

    const [eventsRes, membersRes, rsvpsRes, upcomingRes] = await Promise.all([
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "member"),
      supabase
        .from("event_rsvps")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()),
      supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("status", "upcoming"),
    ]);

    return {
      totalEvents: eventsRes.count ?? 0,
      totalMembers: membersRes.count ?? 0,
      recentRsvps: rsvpsRes.count ?? 0,
      upcomingEvents: upcomingRes.count ?? 0,
    };
  } catch (error) {
    logger.error("Admin stats query failed", error);
    return { totalEvents: 0, totalMembers: 0, recentRsvps: 0, upcomingEvents: 0 };
  }
}
