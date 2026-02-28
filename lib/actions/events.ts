"use server";

import { createClient } from "@/lib/supabase/server";
import { withActionHandler, type ActionResult } from "@/lib/action-handler";
import { requireAuth, requireAdmin, requireOwnership } from "@/lib/auth-guard";
import { validateInput } from "@/lib/validate";
import { sanitizeTextInput } from "@/lib/sanitize";
import { createEventSchema, updateEventSchema, upsertRsvpSchema } from "@/lib/schemas";
import { ActionError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import type { Event } from "@/types";

export async function createEvent(input: unknown): Promise<ActionResult<Event>> {
  return withActionHandler("createEvent", async () => {
    const authUser = await requireAdmin();
    const data = validateInput(createEventSchema, input);

    const supabase = await createClient();
    const { data: event, error } = await supabase
      .from("events")
      .insert({
        ...data,
        title: sanitizeTextInput(data.title),
        description: data.description
          ? sanitizeTextInput(data.description)
          : null,
        created_by: authUser.id,
      })
      .select()
      .single();

    if (error) throw error;

    logger.audit("event.created", { eventId: event.id, userId: authUser.id });
    return event as Event;
  });
}

export async function updateEvent(input: unknown): Promise<ActionResult<Event>> {
  return withActionHandler("updateEvent", async () => {
    const authUser = await requireAuth();
    const data = validateInput(updateEventSchema, input);

    if (authUser.role !== "admin") {
      await requireOwnership("events", data.id, "created_by", authUser.id);
    }

    const supabase = await createClient();
    const updateData: Record<string, unknown> = { ...data };
    delete updateData.id;

    if (data.title) updateData.title = sanitizeTextInput(data.title);
    if (data.description)
      updateData.description = sanitizeTextInput(data.description);

    const { data: event, error } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", data.id)
      .select()
      .single();

    if (error) throw error;

    logger.audit("event.updated", { eventId: data.id, userId: authUser.id });
    return event as Event;
  });
}

export async function deleteEvent(eventId: string): Promise<ActionResult> {
  return withActionHandler("deleteEvent", async () => {
    const authUser = await requireAdmin();

    const supabase = await createClient();
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (error) throw error;

    logger.audit("event.deleted", { eventId, userId: authUser.id });
  });
}

export async function upsertRsvp(
  input: unknown
): Promise<ActionResult<{ status: string }>> {
  return withActionHandler("upsertRsvp", async () => {
    const authUser = await requireAuth();
    const data = validateInput(upsertRsvpSchema, input);

    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("event_rsvps")
      .select("id")
      .eq("event_id", data.event_id)
      .eq("user_id", authUser.id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("event_rsvps")
        .update({ status: data.status })
        .eq("event_id", data.event_id)
        .eq("user_id", authUser.id);

      if (error) throw error;
    } else {
      const { data: event } = await supabase
        .from("events")
        .select("max_participants")
        .eq("id", data.event_id)
        .single();

      if (event?.max_participants) {
        const { count } = await supabase
          .from("event_rsvps")
          .select("*", { count: "exact", head: true })
          .eq("event_id", data.event_id)
          .eq("status", "attending");

        if ((count ?? 0) >= event.max_participants && data.status === "attending") {
          throw new ActionError(
            "Bu etkinlik için katılımcı limiti dolmuştur.",
            "CAPACITY_FULL",
            409
          );
        }
      }

      const { error } = await supabase.from("event_rsvps").insert({
        event_id: data.event_id,
        user_id: authUser.id,
        status: data.status,
      });

      if (error) throw error;
    }

    logger.audit("rsvp.upserted", {
      eventId: data.event_id,
      userId: authUser.id,
      status: data.status,
    });

    return { status: data.status };
  });
}

export async function deleteRsvp(eventId: string): Promise<ActionResult> {
  return withActionHandler("deleteRsvp", async () => {
    const authUser = await requireAuth();

    const supabase = await createClient();
    const { error } = await supabase
      .from("event_rsvps")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", authUser.id);

    if (error) throw error;

    logger.audit("rsvp.deleted", { eventId, userId: authUser.id });
  });
}
