"use server";

import { createClient } from "@/lib/supabase/server";
import { withActionHandler, type ActionResult } from "@/lib/action-handler";
import { requireAuth, requireAdmin } from "@/lib/auth-guard";
import { validateInput } from "@/lib/validate";
import { updateProfileSchema } from "@/lib/schemas";
import { sanitizeTextInput } from "@/lib/sanitize";
import { logger } from "@/lib/logger";
import type { Profile } from "@/types";

export async function updateProfile(
  input: unknown
): Promise<ActionResult<Profile>> {
  return withActionHandler("updateProfile", async () => {
    const authUser = await requireAuth();
    const data = validateInput(updateProfileSchema, input);

    const updateData: Record<string, unknown> = {};
    if (data.full_name)
      updateData.full_name = sanitizeTextInput(data.full_name);
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.avatar_url !== undefined) updateData.avatar_url = data.avatar_url;
    if (data.notification_prefs)
      updateData.notification_prefs = data.notification_prefs;

    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", authUser.id)
      .select()
      .single();

    if (error) throw error;

    logger.audit("profile.updated", { userId: authUser.id });
    return profile as Profile;
  });
}

export async function updateMemberRole(
  userId: string,
  role: "admin" | "member"
): Promise<ActionResult> {
  return withActionHandler("updateMemberRole", async () => {
    const authUser = await requireAdmin();

    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (error) throw error;

    logger.audit("profile.roleChanged", {
      targetUserId: userId,
      newRole: role,
      changedBy: authUser.id,
    });
  });
}
