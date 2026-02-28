const HTML_ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

const HTML_ENTITY_RE = /[&<>"'/]/g;

export function sanitizeTextInput(input: string): string {
  return input
    .trim()
    .replace(HTML_ENTITY_RE, (char) => HTML_ENTITY_MAP[char] ?? char);
}

export function sanitizeEmail(email: string): string {
  return email.normalize("NFKC").toLowerCase().trim();
}
