"use server";

import { createClient } from "@/lib/supabase/server";
import { withRateLimit, type RateLimitConfig } from "@/lib/rate-limit-action";
import type { ActionResult } from "@/lib/action-handler";

const LOGIN_LIMIT: RateLimitConfig = {
  prefix: "login",
  maxRequests: 5,
  windowMs: 15 * 60 * 1000,
};

const REGISTER_LIMIT: RateLimitConfig = {
  prefix: "register",
  maxRequests: 3,
  windowMs: 60 * 60 * 1000,
};

export async function loginAction(
  email: string,
  password: string
): Promise<ActionResult> {
  return withRateLimit(LOGIN_LIMIT, async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  });
}

export async function registerAction(
  email: string,
  password: string,
  fullName: string
): Promise<ActionResult> {
  return withRateLimit(REGISTER_LIMIT, async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: undefined };
  });
}
