"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send, Wallet, Clock, CheckCircle, AlertCircle, Copy, Download, Users } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { WalletGuard } from "@/components/wallet-guard"
import { useWallet } from "@/components/wallet-provider"
import { BankingIdentityManager } from "@/components/banking-identity-manager"
import Link from "next/link"
import { FilecoinStorage, type StoredDocument } from "@/lib/filecoin-storage"
import { FlareOracle } from "@/lib/flare-oracle"
import { ENSService, type FamilyGroup } from "@/lib/ens-service"
import { FamilyContractService } from "@/lib/family-contract"

interface RemittanceData {
  recipientAddress: string
  amount: string
  recipientName: string
  recipientPhone: string
  purpose: string
  sendToFamily: boolean
  familyGroupId?: string
  targetMemberId?: string
}

interface PendingRemittance {
  id: string
  senderAddress: string
  amount: string
  timestamp: string
  status: "pending" | "matched" | "completed"
  senderName?: string
}

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountType: "savings" | "checking"
  accountHolderName: string
  accountHolderCedula: string
  isVerified: boolean
  isPrimary: boolean
}

export default function RemittanceDemo() {
  const { t } = useLanguage()
  const { address } = useWallet()
  const [activeTab, setActiveTab] = useState("send")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null)
  const [currentRate, setCurrentRate] = useState<number>(1.0)
  const [isLoadingRate, setIsLoadingRate] = useState(false)
  const [storedDocuments, setStoredDocuments] = useState<StoredDocument[]>([])

  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([])
  const [selectedFamilyGroup, setSelectedFamilyGroup] = useState<FamilyGroup | null>(null)
  const ensService = ENSService.getInstance()
  const familyContractService = FamilyContractService.getInstance()

  // Mock pending remittances for demo
  const [pendingRemittances] = useState<PendingRemittance[]>([
    {
      id: "rem_001",
      senderAddress: "0x1234...5678",
      amount: "250",
      timestamp: "2024-01-15T10:30:00Z",
      status: "pending",
      senderName: "María González",
    },
    {
      id: "rem_002",
      senderAddress: "0x9876...4321",
      amount: "500",
      timestamp: "2024-01-15T09:15:00Z",
      status: "matched",
      senderName: "Carlos Rodríguez",
    },
  ])

  const updatePriceData = async () => {
    setIsLoadingRate(true)
    try {
      const oracle = FlareOracle.getInstance()
      const priceData = await oracle.getUSDCPrice()
      setCurrentRate(priceData.price)
    } catch (error) {
      console.error("[v0] Error fetching price data:", error)
    } finally {
      setIsLoadingRate(false)
    }
  }

  const loadFamilyGroups = () => {
    if (!address) return
    const groups = ensService.getFamilyGroupsForAddress(address)
    setFamilyGroups(groups)
  }

  // Update price on component mount and periodically
  useEffect(() => {
    updatePriceData()
    const interval = setInterval(updatePriceData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (address) {
      loadFamilyGroups()
    }
  }, [address])

  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const oracle = FlareOracle.getInstance()
      const conversionData = await oracle.calculateReceiveAmount(Number.parseFloat(sendData.amount))

      if (sendData.sendToFamily && sendData.familyGroupId) {
        // Send to family group using contract service
        const targetMemberAddress = sendData.targetMemberId
          ? selectedFamilyGroup?.members.find((m) => m.id === sendData.targetMemberId)?.address
          : undefined

        const familyRemittance = await familyContractService.sendToFamilyGroup(
          address!,
          sendData.familyGroupId,
          sendData.amount,
          targetMemberAddress,
        )

        setTransactionHash(familyRemittance.transactionHash || "")

        // Store family remittance record
        const filecoinStorage = FilecoinStorage.getInstance()
        const transactionRecord = {
          type: "family_remittance" as const,
          content: JSON.stringify({
            ...familyRemittance,
            conversionData,
            familyGroupName: selectedFamilyGroup?.name,
            targetMemberName: targetMemberAddress
              ? selectedFamilyGroup?.members.find((m) => m.address === targetMemberAddress)?.name
              : "Grupo completo",
          }),
          metadata: {
            transactionId: familyRemittance.transactionHash || "",
            timestamp: new Date().toISOString(),
            hash: familyRemittance.transactionHash || "",
          },
        }

        await filecoinStorage.storeDocument(transactionRecord)

        console.log("[v0] Family remittance sent:", {
          ...familyRemittance,
          conversionData,
          timestamp: new Date().toISOString(),
        })
      } else {
        // Regular remittance flow
        // Simulate blockchain transaction
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Generate mock transaction hash
        const mockTxHash = "0x" + Math.random().toString(16).substr(2, 64)
        setTransactionHash(mockTxHash)

        const filecoinStorage = FilecoinStorage.getInstance()
        const transactionRecord = {
          type: "transaction_record" as const,
          content: JSON.stringify({
            transactionHash: mockTxHash,
            senderAddress: address,
            recipientAddress: sendData.recipientAddress,
            amount: sendData.amount,
            recipientName: sendData.recipientName,
            recipientPhone: sendData.recipientPhone,
            purpose: sendData.purpose,
            conversionData,
            timestamp: new Date().toISOString(),
          }),
          metadata: {
            transactionId: mockTxHash,
            timestamp: new Date().toISOString(),
            hash: mockTxHash,
          },
        }

        await filecoinStorage.storeDocument(transactionRecord)

        console.log("[v0] Remittance sent with Flare pricing:", {
          ...sendData,
          senderAddress: address,
          transactionHash: mockTxHash,
          conversionData,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Error sending remittance:", error)
      alert("Error al enviar la remesa. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReceiveRemittance = async (remittanceId: string) => {
    console.log("[v0] Processing remittance reception:", remittanceId)
    // This would trigger the banking identity system
    setActiveTab("banking")
  }

  const handleConfirmReception = async (remittanceId: string) => {
    if (!selectedBankAccount) {
      alert("Por favor selecciona una cuenta bancaria para recibir el depósito")
      return
    }

    if (!selectedBankAccount.isVerified) {
      alert("La cuenta bancaria seleccionada debe estar verificada para recibir depósitos")
      return
    }

    console.log("[v0] Confirming remittance reception:", {
      remittanceId,
      bankAccount: selectedBankAccount,
      timestamp: new Date().toISOString(),
    })

    const voucherContent = await generateAndStoreVoucher(remittanceId, selectedBankAccount)
    downloadVoucher(voucherContent, remittanceId)

    alert(
      `Depósito confirmado en ${selectedBankAccount.bankName} - ${selectedBankAccount.accountNumber}. El voucher se ha almacenado en Filecoin y descargado automáticamente.`,
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-EC", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "matched":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "matched":
        return "Emparejado"
      case "completed":
        return "Completado"
      default:
        return status
    }
  }

  const generateAndStoreVoucher = async (remittanceId: string, bankAccount: BankAccount): Promise<string> => {
    const remittance = pendingRemittances.find((r) => r.id === remittanceId)
    if (!remittance || !bankAccount) return ""

    // Get current conversion rate
    const oracle = FlareOracle.getInstance()
    const conversionData = await oracle.calculateReceiveAmount(Number.parseFloat(remittance.amount))

    const voucherData = {
      transactionId: remittanceId,
      date: new Date().toLocaleString("es-EC"),
      amount: remittance.amount,
      senderName: remittance.senderName || "Usuario Anónimo",
      senderAddress: remittance.senderAddress,
      recipientAddress: address,
      bankName: bankAccount.bankName,
      accountNumber: bankAccount.accountNumber,
      accountHolderName: bankAccount.accountHolderName,
      accountHolderCedula: bankAccount.accountHolderCedula,
      conversionRate: conversionData.rate,
      grossAmount: conversionData.grossAmount,
      fees: conversionData.fees,
      netAmount: conversionData.netAmount,
      flareTimestamp: new Date().toISOString(),
      breakdown: conversionData.breakdown,
    }

    // Create enhanced PDF content with Flare pricing data
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Voucher de Transacción - RemesaChain</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #15803d; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { color: #15803d; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .voucher-title { color: #15803d; font-size: 20px; margin-bottom: 5px; }
          .transaction-id { color: #666; font-size: 14px; }
          .section { margin-bottom: 25px; }
          .section-title { color: #15803d; font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px 0; }
          .info-label { font-weight: bold; color: #555; }
          .info-value { color: #333; }
          .amount-highlight { background-color: #f0f9f4; padding: 15px; border-left: 4px solid #15803d; margin: 15px 0; }
          .amount-large { font-size: 24px; font-weight: bold; color: #15803d; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px; }
          .blockchain-info { background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin: 10px 0; }
          .oracle-data { background-color: #e3f2fd; padding: 10px; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">RemesaChain</div>
          <div class="voucher-title">Voucher de Transacción Verificado</div>
          <div class="transaction-id">ID: ${voucherData.transactionId}</div>
        </div>

        <div class="section">
          <div class="section-title">Información de la Transacción</div>
          <div class="info-row">
            <span class="info-label">Fecha y Hora:</span>
            <span class="info-value">${voucherData.date}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Estado:</span>
            <span class="info-value">Completado ✓</span>
          </div>
        </div>

        <div class="amount-highlight">
          <div style="text-align: center;">
            <div>Monto Depositado</div>
            <div class="amount-large">$${voucherData.netAmount.toFixed(2)} USD</div>
          </div>
        </div>

        <div class="oracle-data">
          <div class="section-title">Datos del Oráculo Flare (FTSO)</div>
          <div class="info-row">
            <span class="info-label">Tasa de Conversión USDC/USD:</span>
            <span class="info-value">${voucherData.conversionRate.toFixed(6)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Timestamp del Oráculo:</span>
            <span class="info-value">${voucherData.flareTimestamp}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Fuente de Precio:</span>
            <span class="info-value">Flare Time Series Oracle (FTSO)</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Desglose Detallado de Conversión</div>
          <div class="info-row">
            <span class="info-label">Monto Original:</span>
            <span class="info-value">${voucherData.breakdown.originalAmount} USDC</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tasa de Cambio:</span>
            <span class="info-value">${voucherData.breakdown.exchangeRate.toFixed(6)} USDC/USD</span>
          </div>
          <div class="info-row">
            <span class="info-label">Valor Bruto en USD:</span>
            <span class="info-value">$${voucherData.breakdown.grossUSD.toFixed(2)} USD</span>
          </div>
          <div class="info-row">
            <span class="info-label">Comisión de Red:</span>
            <span class="info-value">$${voucherData.breakdown.networkFee.toFixed(2)} USD</span>
          </div>
          <div class="info-row">
            <span class="info-label">Comisión RemesaChain:</span>
            <span class="info-value">$${voucherData.breakdown.platformFee.toFixed(2)} USD</span>
          </div>
          <div class="info-row" style="border-top: 1px solid #eee; padding-top: 8px; font-weight: bold;">
            <span class="info-label">Total Depositado:</span>
            <span class="info-value">$${voucherData.breakdown.finalAmount.toFixed(2)} USD</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Detalles del Remitente</div>
          <div class="info-row">
            <span class="info-label">Nombre:</span>
            <span class="info-value">${voucherData.senderName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Dirección Wallet:</span>
            <span class="info-value">${voucherData.senderAddress}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Detalles del Receptor</div>
          <div class="info-row">
            <span class="info-label">Nombre:</span>
            <span class="info-value">${voucherData.accountHolderName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Cédula:</span>
            <span class="info-value">${voucherData.accountHolderCedula}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Dirección Wallet:</span>
            <span class="info-value">${voucherData.recipientAddress}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Información Bancaria</div>
          <div class="info-row">
            <span class="info-label">Banco:</span>
            <span class="info-value">${voucherData.bankName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Número de Cuenta:</span>
            <span class="info-value">${voucherData.accountNumber}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Titular:</span>
            <span class="info-value">${voucherData.accountHolderName}</span>
          </div>
        </div>

        <div class="blockchain-info">
          <div class="section-title">Verificación Blockchain</div>
          <p><strong>Almacenamiento Descentralizado:</strong> Este voucher está almacenado permanentemente en Filecoin para auditoría y verificación.</p>
          <p><strong>Precios Verificados:</strong> Las tasas de conversión son obtenidas de oráculos descentralizados Flare (FTSO) para máxima transparencia.</p>
          <p><strong>Hash de Transacción:</strong> ${voucherData.transactionId}</p>
        </div>

        <div class="footer">
          <p>Este voucher es una confirmación oficial verificada en blockchain</p>
          <p>Almacenado en Filecoin | Precios de Flare FTSO | Para soporte: support@remesachain.com</p>
          <p>RemesaChain - Remesas familiares descentralizadas para Ecuador</p>
        </div>
      </body>
      </html>
    `

    const filecoinStorage = FilecoinStorage.getInstance()
    const documentId = await filecoinStorage.storeDocument({
      type: "voucher",
      content: pdfContent,
      metadata: {
        transactionId: remittanceId,
        timestamp: new Date().toISOString(),
        hash: remittanceId,
      },
    })

    console.log("[v0] Voucher stored on Filecoin:", documentId)
    return pdfContent
  }

  const downloadVoucher = (content: string, remittanceId: string) => {
    const blob = new Blob([content], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `voucher-${remittanceId}-${Date.now()}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Send remittance state
  const [sendData, setSendData] = useState<RemittanceData>({
    recipientAddress: "",
    amount: "",
    recipientName: "",
    recipientPhone: "",
    purpose: "",
    sendToFamily: false,
    familyGroupId: "",
    targetMemberId: "",
  })

  const handleFamilyGroupChange = (groupId: string) => {
    const group = familyGroups.find((g) => g.id === groupId)
    setSelectedFamilyGroup(group || null)
    setSendData({
      ...sendData,
      familyGroupId: groupId,
      targetMemberId: "",
      recipientAddress: group?.contractAddress || "",
      recipientName: group?.name || "",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Demo de Remesas</h1>
              <p className="text-muted-foreground">Prueba el flujo completo de envío y recepción de remesas</p>
            </div>
          </div>

          <WalletGuard
            title="Conecta tu wallet para usar el demo"
            description="Necesitas conectar tu wallet para enviar y recibir remesas"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="send">Enviar Remesa</TabsTrigger>
                <TabsTrigger value="receive">Recibir Remesa</TabsTrigger>
                <TabsTrigger value="banking">Identidad Bancaria</TabsTrigger>
              </TabsList>

              {/* Send Remittance Tab */}
              <TabsContent value="send" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5 text-primary" />
                      Enviar Remesa
                    </CardTitle>
                    <CardDescription>
                      Envía USDC que será convertido a USD y depositado en una cuenta bancaria ecuatoriana o a un grupo
                      familiar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transactionHash ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-4"
                      >
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-primary">¡Remesa Enviada!</h3>
                          <p className="text-muted-foreground">
                            {sendData.sendToFamily
                              ? "Tu remesa ha sido enviada al grupo familiar y está disponible para retiro"
                              : "Tu remesa ha sido enviada al escrow y está siendo procesada"}
                          </p>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm font-medium mb-2">Hash de transacción:</p>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-background px-2 py-1 rounded flex-1">{transactionHash}</code>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(transactionHash)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          {sendData.sendToFamily ? (
                            <>
                              <p>• La remesa está disponible en el contrato del grupo familiar</p>
                              <p>• Los miembros autorizados pueden retirar los fondos</p>
                              <p>• Los fondos expiran en 7 días si no son retirados</p>
                            </>
                          ) : (
                            <>
                              <p>• La remesa será emparejada con un operador P2P</p>
                              <p>• El operador depositará USD en la cuenta del destinatario</p>
                              <p>• El proceso completo toma entre 5-15 minutos</p>
                            </>
                          )}
                        </div>
                        <Button
                          onClick={() => {
                            setTransactionHash(null)
                            setSendData({
                              recipientAddress: "",
                              amount: "",
                              recipientName: "",
                              recipientPhone: "",
                              purpose: "",
                              sendToFamily: false,
                              familyGroupId: "",
                              targetMemberId: "",
                            })
                          }}
                          variant="outline"
                        >
                          Enviar otra remesa
                        </Button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSendSubmit} className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <input
                              type="checkbox"
                              id="sendToFamily"
                              checked={sendData.sendToFamily}
                              onChange={(e) =>
                                setSendData({
                                  ...sendData,
                                  sendToFamily: e.target.checked,
                                  familyGroupId: "",
                                  targetMemberId: "",
                                  recipientAddress: e.target.checked ? "" : sendData.recipientAddress,
                                })
                              }
                              className="w-4 h-4 text-primary"
                            />
                            <Label htmlFor="sendToFamily" className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Enviar a grupo familiar ENS
                            </Label>
                          </div>

                          {sendData.sendToFamily && (
                            <div className="space-y-3">
                              {familyGroups.length > 0 ? (
                                <>
                                  <div>
                                    <Label>Seleccionar grupo familiar</Label>
                                    <Select value={sendData.familyGroupId} onValueChange={handleFamilyGroupChange}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un grupo familiar" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {familyGroups.map((group) => (
                                          <SelectItem key={group.id} value={group.id}>
                                            {group.name} ({group.ensName}) - {group.members.length} miembros
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {selectedFamilyGroup && (
                                    <div>
                                      <Label>Destinatario específico (opcional)</Label>
                                      <Select
                                        value={sendData.targetMemberId || ""}
                                        onValueChange={(value) => setSendData({ ...sendData, targetMemberId: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Enviar a todo el grupo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="">Todo el grupo (cualquiera puede retirar)</SelectItem>
                                          {selectedFamilyGroup.members
                                            .filter((member) => member.canReceive)
                                            .map((member) => (
                                              <SelectItem key={member.id} value={member.id}>
                                                {member.name} ({member.ensName})
                                              </SelectItem>
                                            ))}
                                        </SelectContent>
                                      </Select>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Si seleccionas un miembro específico, solo esa persona podrá retirar los fondos
                                      </p>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="text-center py-4">
                                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                  <p className="text-sm text-muted-foreground mb-2">No tienes grupos familiares</p>
                                  <Link href="/family-groups">
                                    <Button variant="outline" size="sm">
                                      Crear grupo familiar
                                    </Button>
                                  </Link>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {!sendData.sendToFamily && (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="recipientAddress">Dirección del destinatario *</Label>
                              <Input
                                id="recipientAddress"
                                value={sendData.recipientAddress}
                                onChange={(e) => setSendData({ ...sendData, recipientAddress: e.target.value })}
                                placeholder="0x..."
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="recipientName">Nombre del destinatario *</Label>
                              <Input
                                id="recipientName"
                                value={sendData.recipientName}
                                onChange={(e) => setSendData({ ...sendData, recipientName: e.target.value })}
                                placeholder="Juan Pérez"
                                required={!sendData.sendToFamily}
                              />
                            </div>
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="amount">Cantidad (USDC) *</Label>
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              min="1"
                              max="10000"
                              value={sendData.amount}
                              onChange={(e) => setSendData({ ...sendData, amount: e.target.value })}
                              placeholder="100.00"
                              required
                            />
                          </div>
                          {!sendData.sendToFamily && (
                            <div>
                              <Label htmlFor="recipientPhone">Teléfono del destinatario</Label>
                              <Input
                                id="recipientPhone"
                                value={sendData.recipientPhone}
                                onChange={(e) => setSendData({ ...sendData, recipientPhone: e.target.value })}
                                placeholder="0999123456"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="purpose">Propósito de la remesa</Label>
                          <Input
                            id="purpose"
                            value={sendData.purpose}
                            onChange={(e) => setSendData({ ...sendData, purpose: e.target.value })}
                            placeholder="Gastos familiares, educación, etc."
                          />
                        </div>

                        {/* Transaction Summary with real-time Flare pricing */}
                        {sendData.amount && (
                          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">Resumen de la transacción:</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Precio FTSO:</span>
                                {isLoadingRate ? (
                                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    1 USDC = ${currentRate.toFixed(4)} USD
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span>Cantidad a enviar:</span>
                                <span>{sendData.amount} USDC</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Valor bruto (Flare FTSO):</span>
                                <span>${(Number.parseFloat(sendData.amount) * currentRate).toFixed(2)} USD</span>
                              </div>
                              {!sendData.sendToFamily && (
                                <>
                                  <div className="flex justify-between">
                                    <span>Comisión de red:</span>
                                    <span>$0.25 USD</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Comisión RemesaChain:</span>
                                    <span>$1.00 USD</span>
                                  </div>
                                  <div className="flex justify-between font-medium border-t pt-1">
                                    <span>El destinatario recibirá:</span>
                                    <span>
                                      ${(Number.parseFloat(sendData.amount) * currentRate - 1.25).toFixed(2)} USD
                                    </span>
                                  </div>
                                </>
                              )}
                              {sendData.sendToFamily && (
                                <div className="flex justify-between font-medium border-t pt-1">
                                  <span>Disponible para retiro:</span>
                                  <span>${(Number.parseFloat(sendData.amount) * currentRate).toFixed(2)} USD</span>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2 p-2 bg-blue-50 rounded">
                              💡 Precios actualizados cada 30 segundos desde oráculos Flare (FTSO)
                            </div>
                            {sendData.sendToFamily && selectedFamilyGroup && (
                              <div className="text-xs text-green-700 mt-2 p-2 bg-green-50 rounded">
                                🏠 Enviando a grupo familiar: {selectedFamilyGroup.name}
                                {sendData.targetMemberId && (
                                  <span>
                                    {" "}
                                    → {selectedFamilyGroup.members.find((m) => m.id === sendData.targetMemberId)?.name}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting || (sendData.sendToFamily && !sendData.familyGroupId)}
                        >
                          {isSubmitting ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              {sendData.sendToFamily ? "Enviando a grupo familiar..." : "Enviando remesa..."}
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              {sendData.sendToFamily ? "Enviar a Grupo Familiar" : "Enviar Remesa"}
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Receive Remittance Tab */}
              <TabsContent value="receive" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      Recibir Remesas
                    </CardTitle>
                    <CardDescription>Revisa las remesas pendientes para tu dirección de wallet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-2">Tu dirección de wallet:</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-background px-2 py-1 rounded flex-1">{address}</code>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(address || "")}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Remesas pendientes:</h4>
                        {pendingRemittances.length > 0 ? (
                          <div className="space-y-3">
                            {pendingRemittances.map((remittance) => (
                              <Card key={remittance.id} className="border-l-4 border-l-primary">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div>
                                      <p className="font-medium">${remittance.amount} USD</p>
                                      <p className="text-sm text-muted-foreground">
                                        De: {remittance.senderName || remittance.senderAddress}
                                      </p>
                                    </div>
                                    <Badge className={getStatusColor(remittance.status)}>
                                      {getStatusText(remittance.status)}
                                    </Badge>
                                  </div>

                                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                    <span>ID: {remittance.id}</span>
                                    <span>{formatDate(remittance.timestamp)}</span>
                                  </div>

                                  {remittance.status === "pending" && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleReceiveRemittance(remittance.id)}
                                      className="w-full"
                                    >
                                      Configurar recepción bancaria
                                    </Button>
                                  )}

                                  {remittance.status === "matched" && (
                                    <div className="space-y-3">
                                      <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                          ✓ Emparejado con operador P2P. Selecciona tu cuenta bancaria para el depósito.
                                        </p>
                                      </div>
                                      {selectedBankAccount && (
                                        <div className="bg-muted/50 p-3 rounded-lg">
                                          <p className="text-sm font-medium">Cuenta seleccionada:</p>
                                          <p className="text-sm">
                                            {selectedBankAccount.bankName} - {selectedBankAccount.accountNumber}
                                          </p>
                                        </div>
                                      )}
                                      <Button
                                        size="sm"
                                        onClick={() => handleConfirmReception(remittance.id)}
                                        className="w-full"
                                        disabled={!selectedBankAccount}
                                      >
                                        <Download className="h-4 w-4 mr-2" />
                                        Confirmar depósito y generar voucher
                                      </Button>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No tienes remesas pendientes en este momento</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Banking Identity Tab */}
              <TabsContent value="banking" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Identidad Bancaria</CardTitle>
                    <CardDescription>Configura tus cuentas bancarias para recibir depósitos en USD</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BankingIdentityManager
                      onAccountSelect={setSelectedBankAccount}
                      selectedAccountId={selectedBankAccount?.id}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Demo Warning */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Demo Mode</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Este es un demo funcional. No se procesan transacciones reales de blockchain ni dinero. Todas las
                    operaciones son simuladas para propósitos de demostración.
                  </p>
                </div>
              </div>
            </div>
          </WalletGuard>
        </div>
      </div>
    </div>
  )
}
