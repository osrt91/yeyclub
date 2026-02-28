type LogLevel = "info" | "warn" | "error" | "audit";

const SENSITIVE_KEYS = [
  "password",
  "token",
  "secret",
  "api_key",
  "apiKey",
  "authorization",
  "cookie",
  "session",
];

function maskSensitive(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.map(maskSensitive);
  if (typeof data === "object") {
    const masked: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.some((sk) => key.toLowerCase().includes(sk))) {
        masked[key] = "[REDACTED]";
      } else {
        masked[key] = maskSensitive(value);
      }
    }
    return masked;
  }
  return data;
}

function formatLog(level: LogLevel, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const masked = data !== undefined ? maskSensitive(data) : undefined;
  const parts = [`[${timestamp}] [${level.toUpperCase()}] ${message}`];
  if (masked !== undefined) {
    parts.push(JSON.stringify(masked));
  }
  return parts.join(" ");
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export const logger = {
  info(message: string, data?: unknown) {
    if (isProduction()) return;
    // eslint-disable-next-line no-console
    console.info(formatLog("info", message, data));
  },

  warn(message: string, data?: unknown) {
    // eslint-disable-next-line no-console
    console.warn(formatLog("warn", message, data));
  },

  error(message: string, error?: unknown) {
    const errorData =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error;
    // eslint-disable-next-line no-console
    console.error(formatLog("error", message, errorData));
  },

  audit(action: string, data?: unknown) {
    // eslint-disable-next-line no-console
    console.info(formatLog("audit", `[AUDIT] ${action}`, data));
  },
};
