import { headers } from "next/headers";
import { rateLimit } from "./rate-limit";
import type { ActionResult } from "./action-handler";

export type RateLimitConfig = {
  prefix: string;
  maxRequests: number;
  windowMs: number;
};

async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export async function withRateLimit<T>(
  config: RateLimitConfig,
  action: () => Promise<ActionResult<T>>
): Promise<ActionResult<T>> {
  const ip = await getClientIp();
  const identifier = `${config.prefix}:${ip}`;

  const result = rateLimit(identifier, config.maxRequests, config.windowMs);

  if (!result.success) {
    const retrySeconds = Math.ceil((result.reset - Date.now()) / 1000);
    const minutes = Math.ceil(retrySeconds / 60);
    return {
      success: false,
      error: `Çok fazla istek gönderdiniz. Lütfen ${minutes} dakika sonra tekrar deneyin.`,
    };
  }

  return action();
}
