import type { z } from "zod";
import { ActionError } from "@/lib/errors";

export function validateInput<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new ActionError(
      firstError?.message ?? "Geçersiz veri.",
      "VALIDATION_ERROR",
      400
    );
  }
  return result.data;
}
