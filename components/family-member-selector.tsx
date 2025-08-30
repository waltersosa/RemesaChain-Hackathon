"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, User, Shield, Wallet, ArrowRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { ENSService, type FamilyGroup, type FamilyMember } from "@/lib/ens-service"
import { useWallet } from "@/components/wallet-provider"
import Link from "next/link"

interface FamilyMemberSelectorProps {
  onSelectionChange: (selection: {
    familyGroupId: string | null
    targetMemberId: string | null
    familyGroup: FamilyGroup | null
    targetMember: FamilyMember | null
  }) => void
  selectedGroupId?: string
  selectedMemberId?: string
  showCreateGroupOption?: boolean
}

export function FamilyMemberSelector({
  onSelectionChange,
  selectedGroupId,
  selectedMemberId,
  showCreateGroupOption = true,
}: FamilyMemberSelectorProps) {
  const { t } = useLanguage()
  const { address } = useWallet()
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<FamilyGroup | null>(null)
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)

  const ensService = ENSService.getInstance()

  useEffect(() => {
    if (address) {
      loadFamilyGroups()
    }
  }, [address])

  useEffect(() => {
    if (selectedGroupId && familyGroups.length > 0) {
      const group = familyGroups.find((g) => g.id === selectedGroupId)
      setSelectedGroup(group || null)

      if (selectedMemberId && group) {
        const member = group.members.find((m) => m.id === selectedMemberId)
        setSelectedMember(member || null)
      }
    }
  }, [selectedGroupId, selectedMemberId, familyGroups])

  const loadFamilyGroups = () => {
    if (!address) return
    const groups = ensService.getFamilyGroupsForAddress(address)
    setFamilyGroups(groups)
  }

  const handleGroupChange = (groupId: string) => {
    const group = familyGroups.find((g) => g.id === groupId)
    setSelectedGroup(group || null)
    setSelectedMember(null)

    onSelectionChange({
      familyGroupId: groupId,
      targetMemberId: null,
      familyGroup: group || null,
      targetMember: null,
    })
  }

  const handleMemberChange = (memberId: string) => {
    if (!selectedGroup) return

    const member = memberId ? selectedGroup.members.find((m) => m.id === memberId) : null
    setSelectedMember(member || null)

    onSelectionChange({
      familyGroupId: selectedGroup.id,
      targetMemberId: memberId || null,
      familyGroup: selectedGroup,
      targetMember: member || null,
    })
  }

  const getReceivingMembers = (group: FamilyGroup): FamilyMember[] => {
    return group.members.filter((member) => member.canReceive)
  }

  const getMemberRoleColor = (role: string) => {
    return role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary-foreground"
  }

  if (familyGroups.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">{t("family.no-groups")}</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-sm">{t("family.no-groups.desc")}</p>
          {showCreateGroupOption && (
            <Link href="/family-groups">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                {t("family.create.title")}
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Group Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            Seleccionar Grupo Familiar
          </CardTitle>
          <CardDescription>Elige el grupo familiar al que quieres enviar la remesa</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedGroup?.id || "default"} onValueChange={handleGroupChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un grupo familiar" />
            </SelectTrigger>
            <SelectContent>
              {familyGroups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{group.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {group.ensName}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {group.members.length} miembros
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Group Details */}
      {selectedGroup && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {selectedGroup.name}
              </span>
              <Badge variant="outline">{selectedGroup.ensName}</Badge>
            </CardTitle>
            <CardDescription>
              Administrado por {selectedGroup.adminName} • {selectedGroup.members.length} miembros
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Member Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Destinatario específico (opcional)</label>
              <Select value={selectedMember?.id || "default"} onValueChange={handleMemberChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Enviar a todo el grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Todo el grupo (cualquiera puede retirar)</span>
                    </div>
                  </SelectItem>
                  {getReceivingMembers(selectedGroup).map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{member.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {member.ensName}
                        </Badge>
                        <Badge className={`text-xs ${getMemberRoleColor(member.role)}`}>
                          {t(`family.member.role.${member.role}`)}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Si seleccionas un miembro específico, solo esa persona podrá retirar los fondos
              </p>
            </div>

            {/* Members Overview */}
            <div>
              <h4 className="text-sm font-medium mb-3">Miembros del grupo</h4>
              <div className="grid gap-2">
                {selectedGroup.members.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      selectedMember?.id === member.id ? "border-primary bg-primary/5" : "border-border bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.ensName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getMemberRoleColor(member.role)}`}>
                        {t(`family.member.role.${member.role}`)}
                      </Badge>
                      {member.canWithdraw && (
                        <Badge variant="outline" className="text-xs">
                          <Wallet className="h-3 w-3 mr-1" />
                          Puede retirar
                        </Badge>
                      )}
                      {member.canReceive && (
                        <Badge variant="outline" className="text-xs">
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Puede recibir
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selection Summary */}
            {selectedGroup && (
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-medium text-primary mb-2">Resumen de envío</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Grupo:</span> {selectedGroup.name} ({selectedGroup.ensName})
                  </p>
                  <p>
                    <span className="font-medium">Destinatario:</span>{" "}
                    {selectedMember ? `${selectedMember.name} (${selectedMember.ensName})` : "Todo el grupo"}
                  </p>
                  <p>
                    <span className="font-medium">Contrato:</span>{" "}
                    <code className="text-xs bg-background px-1 py-0.5 rounded">
                      {selectedGroup.contractAddress.slice(0, 10)}...
                    </code>
                  </p>
                  {selectedMember ? (
                    <p className="text-primary">Solo {selectedMember.name} podrá retirar esta remesa</p>
                  ) : (
                    <p className="text-primary">
                      Cualquier miembro con permisos de retiro podrá acceder a estos fondos
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
