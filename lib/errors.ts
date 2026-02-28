export class ActionError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code = "ACTION_ERROR", statusCode = 400) {
    super(message);
    this.name = "ActionError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const SUPABASE_ERROR_MAP: Record<string, string> = {
  "23505": "Bu kayıt zaten mevcut.",
  "23503": "İlişkili kayıt bulunamadı.",
  PGRST116: "Kayıt bulunamadı.",
};

export function mapSupabaseError(code: string): string {
  return SUPABASE_ERROR_MAP[code] ?? "Bir hata oluştu. Lütfen tekrar deneyin.";
}
