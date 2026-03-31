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
        <svg aria-hidden="true" className="send-icon" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12.5L18.2 6.2C18.8 5.9 19.5 6.5 19.2 7.1L12.9 20.3C12.6 21 11.6 20.9 11.4 20.1L9.8 14.6L4.2 13C3.5 12.8 3.4 11.8 4 11.5L5 12.5Z"
            fill="currentColor"
          />
          <path d="M9.8 14.6L19 6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      </button>
    </form>
  );
}
