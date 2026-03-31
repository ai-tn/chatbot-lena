import { ChatMessage } from "@/lib/types";
import { linkifyText } from "@/lib/utils";

type MessageListProps = {
  isLoading: boolean;
  messages: ChatMessage[];
};

export function MessageList({ isLoading, messages }: MessageListProps) {
  return (
    <div className="message-list" aria-live="polite">
      {messages.map((message, index) => {
        const isIntro = index === 0 && message.role === "assistant";

        return (
          <article
            className={[
              "message-row",
              message.role === "assistant" ? "assistant" : "user",
              isIntro ? "intro-row" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={message.id}
          >
            {message.role === "assistant" && !isIntro ? <div className="message-avatar">L</div> : null}
            <div
              className={[
                "message-bubble",
                message.role === "assistant" ? "assistant" : "user",
                isIntro ? "intro-card" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {isIntro ? <span className="message-role intro-label">Asistente</span> : null}
              <div className="message-body">
                {message.content.split("\n").map((line, lineIndex) => (
                  <p key={`${message.id}-${lineIndex}`}>
                    {linkifyText(line).map((chunk, chunkIndex) =>
                      chunk.type === "link" ? (
                        <a
                          href={chunk.value}
                          key={`${message.id}-${lineIndex}-${chunkIndex}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {chunk.value}
                        </a>
                      ) : (
                        <span key={`${message.id}-${lineIndex}-${chunkIndex}`}>{chunk.value}</span>
                      ),
                    )}
                  </p>
                ))}
              </div>
            </div>
          </article>
        );
      })}

      {isLoading ? (
        <article className="message-row assistant" key="loading-indicator">
          <div className="message-avatar">L</div>
          <div className="message-bubble assistant loading">
            <div className="typing-dots" aria-label="Lena esta pensando">
              <span />
              <span />
              <span />
            </div>
          </div>
        </article>
      ) : null}
    </div>
  );
}
