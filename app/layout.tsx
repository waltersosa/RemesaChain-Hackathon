import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { LanguageProvider } from "@/components/language-provider"
import { WalletProvider } from "@/components/wallet-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "RemesaChain — Remesas con USDC para Ecuador vía P2P",
  description:
    "RemesaChain usa USDC y una red P2P local para enviar remesas a Ecuador en minutos con $1 de comisión. Integración con Base, ENS, Filecoin, Flare y Lisk.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <LanguageProvider>
          <WalletProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </WalletProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
