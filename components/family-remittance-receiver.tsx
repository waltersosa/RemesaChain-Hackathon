"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Wallet, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useWallet } from "@/components/wallet-provider"
import { ENSService, type FamilyGroup } from "@/lib/ens-service"
import { FamilyContractService, type FamilyRemittance } from "@/lib/family-contract"

export function FamilyRemittanceReceiver() {
  const { t } = useLanguage()
  const { address } = useWallet()
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([])
  const [withdrawableRemittances, setWithdrawableRemittances] = useState<FamilyRemittance[]>([])
  const [targetedRemittances, setTargetedRemittances] = useState<FamilyRemittance[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const ensService = ENSService.getInstance()
  const contractService = FamilyContractService.getInstance()

  useEffect(() => {
    if (address) {
      loadData()
    }
  }, [address])

  const loadData = () => {
    if (!address) return

    // Load family groups
    const groups = ensService.getFamilyGroupsForAddress(address)
    setFamilyGroups(groups)

    // Load withdrawable remittances
    const withdrawable = contractService.getWithdrawableRemittances(address)
    setWithdrawableRemittances(withdrawable)

    // Load targeted remittances
    const targeted = contractService.getTargetedRemittances(address)
    setTargetedRemittances(targeted)
  }

  const handleWithdraw = async (remittanceId: string) => {
    if (!address) return

    setIsLoading(true)
    try {
      const result = await contractService.withdrawFromFamilyGroup(remittanceId, address)
      alert(`¡Retiro exitoso! Hash de transacción: ${result.transactionHash}`)
      loadData() // Reload data
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
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
      case "deposited":
        return "bg-blue-100 text-blue-800"
      case "withdrawn":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "deposited":
        return "Disponible"
      case "withdrawn":
        return "Retirado"
      case "expired":
        return "Expirado"
      default:
        return status
    }
  }

  const getGroupName = (groupId: string) => {
    const group = familyGroups.find((g) => g.id === groupId)
    return group ? group.name : "Grupo desconocido"
  }

  const allRemittances = [...withdrawableRemittances, ...targetedRemittances].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  if (familyGroups.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">No tienes grupos familiares</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-sm">
            Únete a un grupo familiar o crea uno para recibir remesas familiares
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Grupos Familiares</span>
            </div>
            <p className="text-2xl font-bold text-primary">{familyGroups.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Remesas Disponibles</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{withdrawableRemittances.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Dirigidas a Ti</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{targetedRemittances.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Remittances List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Remesas Familiares
          </CardTitle>
          <CardDescription>Remesas disponibles para retiro en tus grupos familiares</CardDescription>
        </CardHeader>
        <CardContent>
          {allRemittances.length > 0 ? (
            <div className="space-y-4">
              {allRemittances.map((remittance) => (
                <Card key={remittance.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-lg">
                          ${remittance.amount} {remittance.currency}
                        </p>
                        <p className="text-sm text-muted-foreground">Grupo: {getGroupName(remittance.groupId)}</p>
                        <p className="text-sm text-muted-foreground">
                          De: {remittance.senderAddress.slice(0, 6)}...{remittance.senderAddress.slice(-4)}
                        </p>
                        {remittance.targetMember && (
                          <p className="text-sm text-primary">Dirigida específicamente a ti</p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(remittance.status)}>{getStatusText(remittance.status)}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(remittance.createdAt)}</p>
                      </div>
                    </div>

                    {remittance.status === "deposited" && (
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Fondos disponibles para retiro</span>
                          </div>
                          <p className="text-xs text-blue-700">Expira: {formatDate(remittance.expiresAt)}</p>
                        </div>

                        {contractService.canWithdrawRemittance(remittance.id, address || "") && (
                          <Button onClick={() => handleWithdraw(remittance.id)} disabled={isLoading} className="w-full">
                            {isLoading ? (
                              <>
                                <Clock className="h-4 w-4 mr-2 animate-spin" />
                                Procesando retiro...
                              </>
                            ) : (
                              <>
                                <Wallet className="h-4 w-4 mr-2" />
                                Retirar ${remittance.amount} {remittance.currency}
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}

                    {remittance.withdrawnBy && (
                      <div className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                        Retirado por: {remittance.withdrawnBy.slice(0, 6)}...{remittance.withdrawnBy.slice(-4)}
                        {remittance.withdrawnAt && ` el ${formatDate(remittance.withdrawnAt)}`}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tienes remesas familiares pendientes</p>
              <p className="text-sm text-muted-foreground mt-1">
                Las remesas enviadas a tus grupos familiares aparecerán aquí
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
