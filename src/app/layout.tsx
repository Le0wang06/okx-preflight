import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OKX Preflight",
  description: "Safer crypto swap preflight checks before signing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
