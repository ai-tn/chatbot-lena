"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { ChatMessage } from "@/lib/types";
import { createId, extractErrorMessage, getOrCreateSessionId } from "@/lib/utils";

import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";
import { StatusBanner } from "./status-banner";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "assistant-welcome",
    role: "assistant",
    content:
      "Soy el asistente de soporte de TwoNav para Land. Puedo ayudarte a resolver dudas, explicar acciones paso a paso y compartir articulos utiles cuando aporte valor.",
  },
];

export function ChatShell() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string>("session-pending");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const message = input.trim();
    if (!message || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId("user"),
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message,
          sessionId: sessionIdRef.current,
        }),
      });

      const payload = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !payload.reply) {
        throw new Error(payload.error || "No se pudo obtener respuesta del chatbot.");
      }

      const assistantMessage: ChatMessage = {
        id: createId("assistant"),
        role: "assistant",
        content: payload.reply,
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (submissionError) {
      setError(extractErrorMessage(submissionError));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="chat-app-shell">
      <section className="device-frame">
        <div className="device-glow" />
        <section className="chat-panel">
          <header className="chat-header">
            <div className="app-badge-row">
              <div className="app-badge">TN</div>
              <div>
                <p className="eyebrow">TwoNav Support</p>
                <h1>Chat Land Assistant</h1>
              </div>
            </div>
            <div className="header-actions">
              <div className="status-chip">Conectado a Make</div>
              <div className="platform-pill">Web app</div>
            </div>
          </header>

          <StatusBanner error={error} isLoading={isLoading} />

          <div className="chat-surface">
            <div className="chat-intro-card">
              <p className="intro-kicker">Asistente</p>
              <p className="intro-text">
                Resuelve dudas sobre Land, explica acciones paso a paso y comparte ayuda relevante cuando realmente aporta valor.
              </p>
            </div>

            <MessageList isLoading={isLoading} messages={messages} />
            <div ref={scrollRef} />
          </div>

          <MessageInput
            disabled={isLoading}
            onChange={setInput}
            onSubmit={handleSubmit}
            value={input}
          />
        </section>
      </section>
    </main>
  );
}
