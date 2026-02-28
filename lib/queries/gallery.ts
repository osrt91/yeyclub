import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/helpers";
import { MOCK_GALLERY, MOCK_EVENTS } from "@/lib/data/mock-data";
import { logger } from "@/lib/logger";
import type { GalleryItem } from "@/types";

type GalleryEvent = { id: string; title: string };

export async function getGalleryItems(
  eventId?: string,
  mediaType?: string
): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) {
    let items = MOCK_GALLERY;
    if (eventId) items = items.filter((g) => g.event_id === eventId);
    if (mediaType) items = items.filter((g) => g.media_type === mediaType);
    return items;
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (eventId) query = query.eq("event_id", eventId);
    if (mediaType) query = query.eq("media_type", mediaType);

    const { data, error } = await query;

    if (error) {
      logger.error("Failed to fetch gallery items", error);
      return MOCK_GALLERY;
    }
    return (data as GalleryItem[]) ?? [];
  } catch (error) {
    logger.error("Gallery items query failed", error);
    return MOCK_GALLERY;
  }
}

export async function getGalleryEvents(): Promise<GalleryEvent[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_EVENTS.map((e) => ({ id: e.id, title: e.title }));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("id, title")
      .order("event_date", { ascending: false })
      .limit(20);

    if (error) {
      logger.error("Failed to fetch gallery events", error);
      return MOCK_EVENTS.map((e) => ({ id: e.id, title: e.title }));
    }
    return (data as GalleryEvent[]) ?? [];
  } catch (error) {
    logger.error("Gallery events query failed", error);
    return [];
  }
}

export async function getGalleryItemsWithEventNames(): Promise<
  (GalleryItem & { event_title?: string })[]
> {
  if (!isSupabaseConfigured()) {
    return MOCK_GALLERY.map((g) => ({
      ...g,
      event_title: MOCK_EVENTS.find((e) => e.id === g.event_id)?.title,
    }));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*, event:events!event_id(title)")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Failed to fetch gallery with events", error);
      return MOCK_GALLERY;
    }

    return (data ?? []).map((item: Record<string, unknown>) => {
      const { event, ...rest } = item;
      return {
        ...(rest as unknown as GalleryItem),
        event_title: (event as { title?: string } | null)?.title,
      };
    });
  } catch (error) {
    logger.error("Gallery with events query failed", error);
    return MOCK_GALLERY;
  }
}
