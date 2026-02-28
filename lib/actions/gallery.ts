"use server";

import { createClient } from "@/lib/supabase/server";
import { withActionHandler, type ActionResult } from "@/lib/action-handler";
import { requireAuth, requireAdmin } from "@/lib/auth-guard";
import { validateInput } from "@/lib/validate";
import { createGalleryItemSchema } from "@/lib/schemas";
import { logger } from "@/lib/logger";
import type { GalleryItem } from "@/types";

export async function createGalleryItem(
  input: unknown
): Promise<ActionResult<GalleryItem>> {
  return withActionHandler("createGalleryItem", async () => {
    const authUser = await requireAuth();
    const data = validateInput(createGalleryItemSchema, input);

    const supabase = await createClient();
    const { data: item, error } = await supabase
      .from("gallery_items")
      .insert({
        ...data,
        uploaded_by: authUser.id,
      })
      .select()
      .single();

    if (error) throw error;

    logger.audit("gallery.created", { itemId: item.id, userId: authUser.id });
    return item as GalleryItem;
  });
}

export async function deleteGalleryItem(itemId: string): Promise<ActionResult> {
  return withActionHandler("deleteGalleryItem", async () => {
    const authUser = await requireAdmin();

    const supabase = await createClient();
    const { error } = await supabase
      .from("gallery_items")
      .delete()
      .eq("id", itemId);

    if (error) throw error;

    logger.audit("gallery.deleted", { itemId, userId: authUser.id });
  });
}
