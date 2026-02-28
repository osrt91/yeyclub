"use server";

import { ActionError, mapSupabaseError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function withActionHandler<T>(
  actionName: string,
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    if (error instanceof ActionError) {
      logger.warn(`Action [${actionName}] failed: ${error.message}`, {
        code: error.code,
      });
      return { success: false, error: error.message };
    }

    const supabaseCode =
      error instanceof Error &&
      "code" in error &&
      typeof (error as Record<string, unknown>).code === "string"
        ? ((error as Record<string, unknown>).code as string)
        : null;

    if (supabaseCode && mapSupabaseError(supabaseCode) !== "Bir hata oluştu. Lütfen tekrar deneyin.") {
      const mapped = mapSupabaseError(supabaseCode);
      logger.warn(`Action [${actionName}] Supabase error`, {
        code: supabaseCode,
      });
      return { success: false, error: mapped };
    }

    logger.error(`Action [${actionName}] unexpected error`, error);
    return {
      success: false,
      error: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }
}
