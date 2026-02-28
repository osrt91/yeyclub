const store = new Map<string, number[]>();

const CLEANUP_INTERVAL_MS = 60_000;
const MAX_ENTRY_AGE_MS = 2 * 60 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, timestamps] of store) {
    if (
      timestamps.length === 0 ||
      now - timestamps[timestamps.length - 1] > MAX_ENTRY_AGE_MS
    ) {
      store.delete(key);
    }
  }
}

export function rateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number; reset: number } {
  cleanup();

  const now = Date.now();
  const windowStart = now - windowMs;

  let timestamps = store.get(identifier) ?? [];
  timestamps = timestamps.filter((t) => t > windowStart);

  if (timestamps.length >= maxRequests) {
    const reset = timestamps[0] + windowMs;
    return { success: false, remaining: 0, reset };
  }

  timestamps.push(now);
  store.set(identifier, timestamps);

  return {
    success: true,
    remaining: maxRequests - timestamps.length,
    reset: now + windowMs,
  };
}
