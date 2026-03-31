type StatusBannerProps = {
  error: string | null;
  isLoading: boolean;
};

export function StatusBanner({ error, isLoading }: StatusBannerProps) {
  if (error) {
    return <div className="status-banner error">{error}</div>;
  }

  if (isLoading) {
    return <div className="status-banner loading">Lena esta escribiendo...</div>;
  }

  return null;
}
