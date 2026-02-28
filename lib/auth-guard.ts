import { createClient } from "@/lib/supabase/server";
import { ActionError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export type AuthUser = {
  id: string;
  email: string;
  role: "admin" | "member";
};

export async function requireAuth(): Promise<AuthUser> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    logger.warn("Auth failed: no session", { error: error?.message });
    throw new ActionError("Oturum açmanız gerekiyor.", "UNAUTHORIZED", 401);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    role: (profile?.role as "admin" | "member") ?? "member",
  };
}

export async function requireAdmin(): Promise<AuthUser> {
  const authUser = await requireAuth();
  if (authUser.role !== "admin") {
    logger.warn("Admin access denied", { userId: authUser.id });
    throw new ActionError("Bu işlem için yetkiniz yok.", "FORBIDDEN", 403);
  }
  return authUser;
}

export async function requireOwnership(
  table: string,
  recordId: string,
  ownerColumn: string,
  userId: string
): Promise<void> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .select(ownerColumn)
    .eq("id", recordId)
    .single();

  if (error || !data) {
    throw new ActionError("Kayıt bulunamadı.", "NOT_FOUND", 404);
  }

  const ownerId = (data as Record<string, unknown>)[ownerColumn];
  if (ownerId !== userId) {
    logger.warn("Ownership check failed", {
      table,
      recordId,
      userId,
    });
    throw new ActionError("Bu işlem için yetkiniz yok.", "FORBIDDEN", 403);
  }
}

export async function getOptionalAuth(): Promise<AuthUser | null> {
  try {
    return await requireAuth();
  } catch {
    return null;
  }
}
