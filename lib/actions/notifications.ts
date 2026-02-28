"use server";

import { createClient } from "@/lib/supabase/server";
import { withActionHandler, type ActionResult } from "@/lib/action-handler";
import { requireAuth, requireAdmin } from "@/lib/auth-guard";
import { validateInput } from "@/lib/validate";
import { createNotificationSchema, sendBulkNotificationSchema } from "@/lib/schemas";
import { sanitizeTextInput } from "@/lib/sanitize";
import { logger } from "@/lib/logger";

export async function markNotificationAsRead(
  notificationId: string
): Promise<ActionResult> {
  return withActionHandler("markNotificationAsRead", async () => {
    const authUser = await requireAuth();

    const supabase = await createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)
      .eq("user_id", authUser.id);

    if (error) throw error;
  });
}

export async function markAllNotificationsAsRead(): Promise<ActionResult> {
  return withActionHandler("markAllNotificationsAsRead", async () => {
    const authUser = await requireAuth();

    const supabase = await createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", authUser.id)
      .eq("read", false);

    if (error) throw error;

    logger.audit("notifications.markAllRead", { userId: authUser.id });
  });
}

export async function createNotification(
  input: unknown
): Promise<ActionResult> {
  return withActionHandler("createNotification", async () => {
    await requireAdmin();
    const data = validateInput(createNotificationSchema, input);

    const supabase = await createClient();
    const { error } = await supabase.from("notifications").insert({
      ...data,
      title: sanitizeTextInput(data.title),
      message: data.message ? sanitizeTextInput(data.message) : null,
    });

    if (error) throw error;

    logger.audit("notification.created", { userId: data.user_id });
  });
}

export async function sendBulkNotification(
  input: unknown
): Promise<ActionResult<{ count: number }>> {
  return withActionHandler("sendBulkNotification", async () => {
    const authUser = await requireAdmin();
    const data = validateInput(sendBulkNotificationSchema, input);

    const supabase = await createClient();

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id");

    if (profilesError) throw profilesError;

    const notifications = (profiles ?? []).map(
      (profile: { id: string }) => ({
        user_id: profile.id,
        title: sanitizeTextInput(data.title),
        message: data.message ? sanitizeTextInput(data.message) : null,
        type: data.type ?? "system",
      })
    );

    if (notifications.length === 0) return { count: 0 };

    const { error } = await supabase
      .from("notifications")
      .insert(notifications);

    if (error) throw error;

    logger.audit("notification.bulk", {
      count: notifications.length,
      userId: authUser.id,
    });
    return { count: notifications.length };
  });
}
