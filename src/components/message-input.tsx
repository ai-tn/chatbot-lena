import { FormEvent, KeyboardEvent } from "react";

type MessageInputProps = {
  disabled: boolean;
  onChange: (value: string) => void;
  onSubmit: (event?: FormEvent<HTMLFormElement>) => void;
  value: string;
};

export function MessageInput({ disabled, onChange, onSubmit, value }: MessageInputProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <form className="message-composer" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="message">
        Escribe tu pregunta
      </label>
      <div className="composer-field">
        <textarea
          id="message"
          name="message"
          placeholder="Pregunta algo sobre Land..."
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <span className="composer-hint">Enter para enviar, Shift+Enter para salto de linea</span>
      </div>
      <button aria-label="Enviar mensaje" disabled={disabled || !value.trim()} type="submit">
        <span className="send-icon">↑</span>
      </button>
    </form>
  );
}
