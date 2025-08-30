"use client"

import type React from "react"
import { useWallet } from "./wallet-provider"
import { useLanguage } from "./language-provider"
import { WalletConnectButton } from "./wallet-connect-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"

interface WalletGuardProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function WalletGuard({ children, title, description }: WalletGuardProps) {
  const { isConnected } = useWallet()
  const { t } = useLanguage()

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>{title || t("common.connect-wallet")}</CardTitle>
            <CardDescription>{description || "Conecta tu wallet para acceder a esta funcionalidad"}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <WalletConnectButton size="lg" className="w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
