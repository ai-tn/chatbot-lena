import { ChatMessage } from "@/lib/types";
import { linkifyText } from "@/lib/utils";

type MessageListProps = {
  isLoading: boolean;
  messages: ChatMessage[];
};

export function MessageList({ isLoading, messages }: MessageListProps) {
  return (
    <div className="message-list" aria-live="polite">
      {messages.map((message) => (
        <article
          className={`message-bubble ${message.role === "assistant" ? "assistant" : "user"}`}
          key={message.id}
        >
          <span className="message-role">{message.role === "assistant" ? "Asistente" : "Tu"}</span>
          <div className="message-body">
            {message.content.split("\n").map((line, index) => (
              <p key={`${message.id}-${index}`}>
                {linkifyText(line).map((chunk, chunkIndex) =>
                  chunk.type === "link" ? (
                    <a href={chunk.value} key={`${message.id}-${index}-${chunkIndex}`} rel="noreferrer" target="_blank">
                      {chunk.value}
                    </a>
                  ) : (
                    <span key={`${message.id}-${index}-${chunkIndex}`}>{chunk.value}</span>
                  ),
                )}
              </p>
            ))}
          </div>
        </article>
      ))}

      {isLoading ? (
        <article className="message-bubble assistant loading" key="loading-indicator">
          <span className="message-role">Asistente</span>
          <div className="typing-dots" aria-label="El asistente esta pensando">
            <span />
            <span />
            <span />
          </div>
        </article>
      ) : null}
    </div>
  );
}
