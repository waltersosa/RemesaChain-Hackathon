"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Users, Plus, TrendingUp, Wallet, Clock, CheckCircle, AlertCircle, Copy, Trash2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { WalletGuard } from "@/components/wallet-guard"
import { useWallet } from "@/components/wallet-provider"
import Link from "next/link"
import { ENSService, type FamilyGroup } from "@/lib/ens-service"
import { FamilyContractService } from "@/lib/family-contract"

export default function FamilyGroupsPage() {
  const { t } = useLanguage()
  const { address } = useWallet()
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<FamilyGroup | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreating, setIsCreating] = useState(false)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Services
  const ensService = ENSService.getInstance()
  const contractService = FamilyContractService.getInstance()

  // Form states
  const [createForm, setCreateForm] = useState({
    name: "",
    ensName: "",
  })

  const [addMemberForm, setAddMemberForm] = useState({
    ensName: "",
    canWithdraw: true,
    canReceive: true,
  })

  // Load family groups on mount
  useEffect(() => {
    if (address) {
      loadFamilyGroups()
    }
  }, [address])

  const loadFamilyGroups = () => {
    if (!address) return
    const groups = ensService.getFamilyGroupsForAddress(address)
    setFamilyGroups(groups)
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0])
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return

    setIsLoading(true)
    try {
      const newGroup = await ensService.createFamilyGroup(address, createForm.name, createForm.ensName)
      setFamilyGroups([...familyGroups, newGroup])
      setSelectedGroup(newGroup)
      setCreateForm({ name: "", ensName: "" })
      setIsCreating(false)
      alert(t("family.create.success"))
    } catch (error) {
      console.error("Error creating family group:", error)
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGroup || !address) return

    setIsLoading(true)
    try {
      const newMember = await ensService.addFamilyMember(selectedGroup.id, addMemberForm.ensName, address, {
        canWithdraw: addMemberForm.canWithdraw,
        canReceive: addMemberForm.canReceive,
      })

      // Update the selected group with the new member
      const updatedGroup = { ...selectedGroup }
      updatedGroup.members.push(newMember)
      setSelectedGroup(updatedGroup)

      // Update the groups list
      const updatedGroups = familyGroups.map((g) => (g.id === selectedGroup.id ? updatedGroup : g))
      setFamilyGroups(updatedGroups)

      setAddMemberForm({ ensName: "", canWithdraw: true, canReceive: true })
      setIsAddingMember(false)
      alert("Miembro agregado exitosamente")
    } catch (error) {
      console.error("Error adding member:", error)
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMember = async (memberAddress: string) => {
    if (!selectedGroup || !address) return
    if (!confirm("¿Estás seguro de que quieres remover este miembro?")) return

    setIsLoading(true)
    try {
      await ensService.removeFamilyMember(selectedGroup.id, memberAddress, address)

      // Update the selected group
      const updatedGroup = { ...selectedGroup }
      updatedGroup.members = updatedGroup.members.filter((m) => m.address !== memberAddress)
      setSelectedGroup(updatedGroup)

      // Update the groups list
      const updatedGroups = familyGroups.map((g) => (g.id === selectedGroup.id ? updatedGroup : g))
      setFamilyGroups(updatedGroups)

      alert("Miembro removido exitosamente")
    } catch (error) {
      console.error("Error removing member:", error)
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
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
        return "Depositado"
      case "withdrawn":
        return "Retirado"
      case "expired":
        return "Expirado"
      default:
        return status
    }
  }

  // Get group statistics and remittances
  const groupStats = selectedGroup ? contractService.getGroupStats(selectedGroup.id) : null
  const groupRemittances = selectedGroup ? contractService.getGroupRemittances(selectedGroup.id) : []

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("family.title")}</h1>
              <p className="text-muted-foreground">{t("family.subtitle")}</p>
            </div>
          </div>

          <WalletGuard
            title="Conecta tu wallet para gestionar grupos familiares"
            description="Necesitas conectar tu wallet para crear y gestionar grupos familiares ENS"
          >
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar - Family Groups List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Mis Grupos</CardTitle>
                      <Button size="sm" onClick={() => setIsCreating(true)} disabled={isLoading}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {familyGroups.length > 0 ? (
                      familyGroups.map((group) => (
                        <div
                          key={group.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedGroup?.id === group.id
                              ? "bg-primary/10 border border-primary/20"
                              : "bg-muted/50 hover:bg-muted"
                          }`}
                          onClick={() => setSelectedGroup(group)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">{group.name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{group.members.length} miembros</div>
                          <div className="text-xs text-muted-foreground">{group.ensName}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">{t("family.no-groups")}</p>
                        <p className="text-xs text-muted-foreground">{t("family.no-groups.desc")}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Create Group Form */}
                {isCreating && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">{t("family.create.title")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCreateGroup} className="space-y-4">
                        <div>
                          <Label htmlFor="groupName">{t("family.create.name")}</Label>
                          <Input
                            id="groupName"
                            value={createForm.name}
                            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                            placeholder="Familia González"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="ensName">{t("family.create.ens")}</Label>
                          <Input
                            id="ensName"
                            value={createForm.ensName}
                            onChange={(e) => setCreateForm({ ...createForm, ensName: e.target.value })}
                            placeholder="maria.eth"
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" size="sm" disabled={isLoading}>
                            {isLoading ? t("common.loading") : t("family.create.submit")}
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => setIsCreating(false)}>
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {selectedGroup ? (
                  <div className="space-y-6">
                    {/* Group Header */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-primary" />
                              {selectedGroup.name}
                            </CardTitle>
                            <CardDescription>
                              Administrado por {selectedGroup.adminName} • {selectedGroup.ensName}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {selectedGroup.members.length} miembros
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* Group Management Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">{t("family.manage.stats")}</TabsTrigger>
                        <TabsTrigger value="members">{t("family.manage.members")}</TabsTrigger>
                        <TabsTrigger value="remittances">{t("family.manage.transactions")}</TabsTrigger>
                      </TabsList>

                      {/* Overview Tab */}
                      <TabsContent value="overview" className="space-y-6">
                        {groupStats && (
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium">{t("family.stats.total-deposited")}</span>
                                </div>
                                <p className="text-2xl font-bold text-green-600">
                                  ${groupStats.totalDeposited.toFixed(2)}
                                </p>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Wallet className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium">{t("family.stats.total-withdrawn")}</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-600">
                                  ${groupStats.totalWithdrawn.toFixed(2)}
                                </p>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Clock className="h-4 w-4 text-yellow-600" />
                                  <span className="text-sm font-medium">{t("family.stats.pending-amount")}</span>
                                </div>
                                <p className="text-2xl font-bold text-yellow-600">
                                  ${groupStats.pendingAmount.toFixed(2)}
                                </p>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium">{t("family.stats.active-remittances")}</span>
                                </div>
                                <p className="text-2xl font-bold text-primary">{groupStats.activeRemittances}</p>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Contract Info */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Información del Contrato</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Dirección del contrato:</span>
                              <div className="flex items-center gap-2">
                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                  {selectedGroup.contractAddress}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(selectedGroup.contractAddress)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Creado:</span>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(selectedGroup.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Estado:</span>
                              <Badge variant={selectedGroup.isActive ? "default" : "secondary"}>
                                {selectedGroup.isActive ? "Activo" : "Inactivo"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Members Tab */}
                      <TabsContent value="members" className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{t("family.manage.members")}</h3>
                          {selectedGroup.adminAddress === address && (
                            <Button size="sm" onClick={() => setIsAddingMember(true)} disabled={isLoading}>
                              <Plus className="h-4 w-4 mr-2" />
                              {t("family.manage.add-member")}
                            </Button>
                          )}
                        </div>

                        {/* Add Member Form */}
                        {isAddingMember && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">{t("family.member.add.title")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <form onSubmit={handleAddMember} className="space-y-4">
                                <div>
                                  <Label htmlFor="memberEns">{t("family.member.add.ens")}</Label>
                                  <Input
                                    id="memberEns"
                                    value={addMemberForm.ensName}
                                    onChange={(e) => setAddMemberForm({ ...addMemberForm, ensName: e.target.value })}
                                    placeholder="carlos.eth"
                                    required
                                  />
                                </div>
                                <div className="space-y-3">
                                  <Label>{t("family.member.add.permissions")}</Label>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">{t("family.member.add.can-withdraw")}</span>
                                    <Switch
                                      checked={addMemberForm.canWithdraw}
                                      onCheckedChange={(checked) =>
                                        setAddMemberForm({ ...addMemberForm, canWithdraw: checked })
                                      }
                                    />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">{t("family.member.add.can-receive")}</span>
                                    <Switch
                                      checked={addMemberForm.canReceive}
                                      onCheckedChange={(checked) =>
                                        setAddMemberForm({ ...addMemberForm, canReceive: checked })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button type="submit" size="sm" disabled={isLoading}>
                                    {isLoading ? t("common.loading") : t("family.member.add.submit")}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsAddingMember(false)}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </form>
                            </CardContent>
                          </Card>
                        )}

                        {/* Members List */}
                        <div className="space-y-3">
                          {selectedGroup.members.map((member) => (
                            <Card key={member.id}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                      <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{member.name}</p>
                                      <p className="text-sm text-muted-foreground">{member.ensName}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge
                                          variant={member.role === "admin" ? "default" : "secondary"}
                                          className="text-xs"
                                        >
                                          {t(`family.member.role.${member.role}`)}
                                        </Badge>
                                        {member.canWithdraw && (
                                          <Badge variant="outline" className="text-xs">
                                            Puede retirar
                                          </Badge>
                                        )}
                                        {member.canReceive && (
                                          <Badge variant="outline" className="text-xs">
                                            Puede recibir
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {selectedGroup.adminAddress === address && member.role !== "admin" && (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveMember(member.address)}
                                        disabled={isLoading}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                                  <div className="flex items-center justify-between">
                                    <span>Agregado: {formatDate(member.addedAt)}</span>
                                    <code className="bg-muted px-2 py-1 rounded">
                                      {member.address.slice(0, 6)}...{member.address.slice(-4)}
                                    </code>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      {/* Remittances Tab */}
                      <TabsContent value="remittances" className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{t("family.remittances.title")}</h3>
                        </div>

                        {groupRemittances.length > 0 ? (
                          <div className="space-y-3">
                            {groupRemittances.map((remittance) => (
                              <Card key={remittance.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div>
                                      <p className="font-medium">
                                        ${remittance.amount} {remittance.currency}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        De: {remittance.senderAddress.slice(0, 6)}...
                                        {remittance.senderAddress.slice(-4)}
                                      </p>
                                      {remittance.targetMember && (
                                        <p className="text-sm text-blue-600">
                                          {t("family.remittances.targeted")}: {remittance.targetMember.slice(0, 6)}...
                                          {remittance.targetMember.slice(-4)}
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <Badge className={getStatusColor(remittance.status)}>
                                        {getStatusText(remittance.status)}
                                      </Badge>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {formatDate(remittance.createdAt)}
                                      </p>
                                    </div>
                                  </div>

                                  {remittance.status === "deposited" && (
                                    <div className="space-y-2">
                                      <div className="text-xs text-muted-foreground">
                                        {t("family.remittances.expires")}: {formatDate(remittance.expiresAt)}
                                      </div>
                                      {contractService.canWithdrawRemittance(remittance.id, address || "") && (
                                        <Button
                                          size="sm"
                                          onClick={async () => {
                                            try {
                                              setIsLoading(true)
                                              const result = await contractService.withdrawFromFamilyGroup(
                                                remittance.id,
                                                address!,
                                              )
                                              alert(`Retiro exitoso! Hash: ${result.transactionHash}`)
                                              // Reload data
                                              loadFamilyGroups()
                                            } catch (error) {
                                              alert(
                                                `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
                                              )
                                            } finally {
                                              setIsLoading(false)
                                            }
                                          }}
                                          disabled={isLoading}
                                        >
                                          <Wallet className="h-4 w-4 mr-2" />
                                          {t("family.remittances.withdraw")}
                                        </Button>
                                      )}
                                    </div>
                                  )}

                                  {remittance.withdrawnBy && (
                                    <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                                      Retirado por: {remittance.withdrawnBy.slice(0, 6)}...
                                      {remittance.withdrawnBy.slice(-4)}
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
                            <p className="text-muted-foreground">{t("family.remittances.empty")}</p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t("family.no-groups")}</h3>
                    <p className="text-muted-foreground mb-6">{t("family.no-groups.desc")}</p>
                    <Button onClick={() => setIsCreating(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t("family.create.title")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </WalletGuard>
        </div>
      </div>
    </div>
  )
}
