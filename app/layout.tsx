import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calculadora de Juros Compostos",
  description:
    "Calculadora completa de juros compostos com gráficos interativos, simulação de aportes e análise de rentabilidade.",
  keywords:
    "juros compostos, calculadora financeira, investimentos, rentabilidade, simulador",
  authors: [{ name: "Calculadora de Juros Compostos" }],
  openGraph: {
    title: "Calculadora de Juros Compostos",
    description:
      "Simule seus investimentos com juros compostos, visualize a evolução do patrimônio e planeje seus objetivos financeiros.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

