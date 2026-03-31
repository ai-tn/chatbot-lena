import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TwoNav Chat Land Assistant",
  description: "Web-app ligera conectada al chatbot de soporte de Land ejecutado en Make.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
