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
      "Hola. Soy Lena y puedo ayudarte con dudas sobre Land, explicar acciones paso a paso y compartir articulos utiles cuando realmente aporten valor.",
  },
];

export function ChatShell() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const sessionIdRef = useRef<string>("session-pending");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const copyStatusTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      if (copyStatusTimeoutRef.current !== null) {
        window.clearTimeout(copyStatusTimeoutRef.current);
      }
    };
  }, []);

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
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }

  async function handleCopyConversation() {
    try {
      await navigator.clipboard.writeText(formatConversation(messages));
      setCopyStatus("Conversacion copiada");
    } catch {
      setCopyStatus("No se pudo copiar la conversacion");
    }

    if (copyStatusTimeoutRef.current !== null) {
      window.clearTimeout(copyStatusTimeoutRef.current);
    }

    copyStatusTimeoutRef.current = window.setTimeout(() => {
      setCopyStatus(null);
      copyStatusTimeoutRef.current = null;
    }, 2400);
  }

  return (
    <main className="chat-app-shell">
      <section className="chat-panel">
        <header className="chat-header">
          <div className="brand-block">
            <div className="avatar-placeholder" aria-hidden="true">
              <span>L</span>
            </div>
            <div>
              <h1>Lena&apos;s Chat</h1>
              <p className="online-status">En linea ahora</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="copy-chat-button" onClick={handleCopyConversation} type="button">
              Copiar chat
            </button>
            {copyStatus ? <p className="copy-chat-status">{copyStatus}</p> : null}
          </div>
        </header>

        <StatusBanner error={error} isLoading={isLoading} />

        <div className="chat-surface">
          <MessageList isLoading={isLoading} messages={messages} />
          <div ref={scrollRef} />
        </div>

        <MessageInput
          inputRef={inputRef}
          isLoading={isLoading}
          onChange={setInput}
          onSubmit={handleSubmit}
          value={input}
        />
      </section>
    </main>
  );
}

function formatConversation(messages: ChatMessage[]) {
  return messages
    .map((message) => {
      const role = message.role === "assistant" ? "Lena" : "Usuario";
      return `${role}:\n${message.content.trim()}`;
    })
    .join("\n\n");
}
