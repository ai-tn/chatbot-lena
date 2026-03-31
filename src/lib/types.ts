export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type ChatRequest = {
  message: string;
  sessionId: string;
};

export type ChatResponse = {
  reply: string;
};
