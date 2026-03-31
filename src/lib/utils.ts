const SESSION_KEY = "chatbot-session-id";

export function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return createId("session");
  }

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }

  const created = createId("session");
  window.localStorage.setItem(SESSION_KEY, created);
  return created;
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Ha ocurrido un error inesperado. Intentalo de nuevo.";
}

export function linkifyText(input: string): Array<{ type: "text" | "link"; value: string }> {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const parts = input.split(urlPattern).filter(Boolean);
  return parts.map((part) => ({
    type: part.match(urlPattern) ? "link" : "text",
    value: part,
  }));
}
