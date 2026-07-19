import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Outfit } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexo — Produtividade, hábitos e saúde",
  description:
    "Nexo é a plataforma premium para organizar tarefas, construir hábitos, acompanhar seu progresso e controlar sua nutrição — tudo em um só lugar.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="font-[family-name:var(--font-body)] antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
