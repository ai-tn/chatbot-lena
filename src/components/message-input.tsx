import { FormEvent } from "react";

type MessageInputProps = {
  disabled: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  value: string;
};

export function MessageInput({ disabled, onChange, onSubmit, value }: MessageInputProps) {
  return (
    <form className="message-composer" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="message">
        Escribe tu pregunta
      </label>
      <textarea
        id="message"
        name="message"
        placeholder="Pregunta algo sobre Land..."
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
      <button disabled={disabled || !value.trim()} type="submit">
        Enviar
      </button>
    </form>
  );
}
