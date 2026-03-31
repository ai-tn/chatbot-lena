type StatusBannerProps = {
  error: string | null;
  isLoading: boolean;
};

export function StatusBanner({ error, isLoading }: StatusBannerProps) {
  if (error) {
    return <div className="status-banner error">{error}</div>;
  }

  if (isLoading) {
    return <div className="status-banner loading">El asistente esta preparando la respuesta...</div>;
  }

  return <div className="status-banner ready">Puedes probar preguntas reales del flujo de soporte de Land.</div>;
}
