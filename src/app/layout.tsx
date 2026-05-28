import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Posts AI — Gerador de Posts para o Instagram",
  description: "Gere posts em HTML + CSS com IA e exporte em imagens PNG de alta resolução para o Instagram.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable}`} style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
