"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface WalletContextType {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  error: string | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isConnected = !!address

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAddress(accounts[0])
        }
      } catch (err) {
        console.error("Error checking wallet connection:", err)
      }
    }
  }

  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("MetaMask no está instalado. Por favor instala MetaMask para continuar.")
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setAddress(accounts[0])

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0])
          } else {
            setAddress(null)
          }
        })

        // Listen for chain changes
        window.ethereum.on("chainChanged", () => {
          window.location.reload()
        })
      }
    } catch (err: any) {
      setError(err.message || "Error conectando la wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setError(null)

    // Remove event listeners
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.removeAllListeners("accountsChanged")
      window.ethereum.removeAllListeners("chainChanged")
    }
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
