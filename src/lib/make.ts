import { ChatRequest, ChatResponse } from "@/lib/types";

const WEBHOOK_ENV = "MAKE_CHAT_WEBHOOK_URL";

export async function sendMessageToMake(payload: ChatRequest): Promise<ChatResponse> {
  const webhookUrl = process.env[WEBHOOK_ENV];
  if (!webhookUrl) {
    throw new Error(`Missing ${WEBHOOK_ENV} environment variable.`);
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "VS-Agent-Chatbot-Web/1.0",
    },
    body: JSON.stringify({
      id: payload.sessionId,
      message: payload.message,
    }),
    cache: "no-store",
  });

  const rawText = await response.text();
  if (!response.ok) {
    throw new Error(`Make webhook returned HTTP ${response.status}: ${rawText}`);
  }

  const normalized = normalizeWebhookReply(rawText);
  return { reply: normalized };
}

function normalizeWebhookReply(rawText: string): string {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return "No se ha recibido respuesta del chatbot.";
  }

  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    const candidates = [parsed.reply, parsed.response, parsed.message, parsed.body, parsed.text];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
    return JSON.stringify(parsed, null, 2);
  } catch {
    return trimmed;
  }
}
