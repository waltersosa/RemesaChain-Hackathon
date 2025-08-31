"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "./wallet-provider"
import { useLanguage } from "./language-provider"
import { Wallet, LogOut } from "lucide-react"
import { ClientOnly } from "./client-only"
import { Skeleton } from "./ui/skeleton"

interface WalletConnectButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function WalletConnectButton({
  variant = "default",
  size = "default",
  className = "",
}: WalletConnectButtonProps) {
  const { address, isConnected, isConnecting, connect, disconnect, error } = useWallet()
  const { t } = useLanguage()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Skeleton para evitar flash de contenido
  const skeleton = (
    <div className="flex items-center gap-2">
      <Skeleton className="h-9 w-32" />
    </div>
  )

  return (
    <ClientOnly fallback={skeleton}>
      {isConnected && address ? (
        <div className="flex items-center gap-2">
          <Button variant="outline" size={size} className={`${className} text-primary border-primary`} disabled>
            <Wallet className="h-4 w-4 mr-2" />
            {formatAddress(address)}
          </Button>
          <Button variant="ghost" size="sm" onClick={disconnect} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Button variant={variant} size={size} onClick={connect} disabled={isConnecting} className={className}>
            <Wallet className="h-4 w-4 mr-2" />
            {isConnecting ? t("common.loading") : t("common.connect-wallet")}
          </Button>
          {error && <p className="text-sm text-destructive text-center max-w-xs">{error}</p>}
        </div>
      )}
    </ClientOnly>
  )
}
