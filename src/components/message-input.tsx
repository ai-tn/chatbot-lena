import { FormEvent, KeyboardEvent, RefObject } from "react";

type MessageInputProps = {
  inputRef: RefObject<HTMLTextAreaElement | null>;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: (event?: FormEvent<HTMLFormElement>) => void;
  value: string;
};

export function MessageInput({ inputRef, isLoading, onChange, onSubmit, value }: MessageInputProps) {
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
      <textarea
        id="message"
        name="message"
        placeholder="Escribe un mensaje..."
        rows={1}
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-busy={isLoading}
      />
      <button aria-label="Enviar mensaje" disabled={!value.trim() || isLoading} type="submit">
        <span className="send-icon">↗</span>
      </button>
    </form>
  );
}
