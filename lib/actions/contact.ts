"use server";

import { withRateLimit, type RateLimitConfig } from "@/lib/rate-limit-action";
import type { ActionResult } from "@/lib/action-handler";

const CONTACT_LIMIT: RateLimitConfig = {
  prefix: "contact",
  maxRequests: 3,
  windowMs: 60 * 60 * 1000,
};

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    }
  );

  const data = await res.json();
  return data.success === true;
}

export async function submitContactForm(
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  },
  turnstileToken: string
): Promise<ActionResult> {
  return withRateLimit(CONTACT_LIMIT, async () => {
    if (turnstileToken) {
      const valid = await verifyTurnstile(turnstileToken);
      if (!valid) {
        return { success: false, error: "CAPTCHA doğrulaması başarısız oldu." };
      }
    }

    return { success: true, data: undefined };
  });
}
