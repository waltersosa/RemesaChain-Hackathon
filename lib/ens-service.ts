"use client"

export interface ENSProfile {
  name: string
  address: string
  avatar?: string
  description?: string
  email?: string
  phone?: string
}

export interface FamilyGroup {
  id: string
  name: string
  description: string
  adminAddress: string
  adminName: string
  members: FamilyMember[]
  contractAddress: string
  createdAt: string
  isActive: boolean
  inviteCode: string // Código único para invitaciones
}

export interface FamilyMember {
  id: string
  address: string | null // Dirección real de la wallet (null hasta que se conecte)
  ensName?: string
  email?: string
  name: string
  role: "admin" | "member"
  canWithdraw: boolean
  canReceive: boolean
  addedAt: string
  addedBy: string
  status: "invited" | "active" | "pending" // Estado del miembro
  inviteToken: string // Token único para verificar la invitación
}

export class ENSService {
  private static instance: ENSService
  private familyGroups: Map<string, FamilyGroup> = new Map()
  private pendingInvites: Map<string, { groupId: string; memberData: Partial<FamilyMember> }> = new Map()

  static getInstance(): ENSService {
    if (!ENSService.instance) {
      ENSService.instance = new ENSService()
    }
    return ENSService.instance
  }

  // Simulate ENS resolution
  async resolveENS(ensName: string): Promise<ENSProfile | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const mockProfiles: Record<string, ENSProfile> = {
      "maria.eth": {
        name: "maria.eth",
        address: "0x1234567890123456789012345678901234567890",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
        description: "Madre de familia en Quito",
        email: "maria@example.com",
        phone: "+593999123456",
      },
      "carlos.eth": {
        name: "carlos.eth",
        address: "0x2345678901234567890123456789012345678901",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
        description: "Hijo estudiante",
        email: "carlos@example.com",
      },
      "ana.eth": {
        name: "ana.eth",
        address: "0x3456789012345678901234567890123456789012",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
        description: "Hija trabajadora",
        email: "ana@example.com",
      },
    }

    if (mockProfiles[ensName]) {
      return mockProfiles[ensName]
    }
    
    if (ensName.endsWith('.eth')) {
      const nameWithoutEth = ensName.replace('.eth', '')
      const dynamicAddress = `0x${Math.random().toString(16).substr(2, 40)}`
      
      const dynamicProfile: ENSProfile = {
        name: ensName,
        address: dynamicAddress,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nameWithoutEth}`,
        description: `Miembro familiar ${nameWithoutEth}`,
        email: `${nameWithoutEth}@example.com`,
      }
      
      console.log(`[Demo] ENS dinámico creado para: ${ensName} -> ${dynamicAddress}`)
      return dynamicProfile
    }
    
    return null
  }

  // Create a new family group (solo nombre y descripción)
  async createFamilyGroup(adminAddress: string, groupName: string, description: string): Promise<FamilyGroup> {
    const groupId = `family_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`
    const inviteCode = Math.random().toString(36).substr(2, 8).toUpperCase()

    console.log(`[CREATE_GROUP] Creando grupo: ${groupName}`)
    console.log(`[CREATE_GROUP] Admin address: ${adminAddress}`)

    const familyGroup: FamilyGroup = {
      id: groupId,
      name: groupName,
      description,
      adminAddress,
      adminName: `Admin ${adminAddress.slice(0, 6)}...`,
      members: [
        {
          id: `member_${Date.now()}`,
          address: adminAddress, // El admin ya tiene su wallet conectada
          ensName: undefined,
          email: undefined,
          name: `Admin ${adminAddress.slice(0, 6)}...`,
          role: "admin",
          canWithdraw: true,
          canReceive: true,
          addedAt: new Date().toISOString(),
          addedBy: adminAddress,
          status: "active",
          inviteToken: "",
        },
      ],
      contractAddress,
      createdAt: new Date().toISOString(),
      isActive: true,
      inviteCode,
    }

    this.familyGroups.set(groupId, familyGroup)

    console.log(`[CREATE_GROUP] Grupo guardado con ID: ${groupId}`)
    console.log(`[CREATE_GROUP] Código de invitación: ${inviteCode}`)

    await new Promise((resolve) => setTimeout(resolve, 2000))
    return familyGroup
  }

  // Invitar miembro por email o ENS (sin dirección)
  async inviteFamilyMember(
    groupId: string,
    memberEmail: string,
    memberName: string,
    adminAddress: string,
    permissions: { canWithdraw: boolean; canReceive: boolean },
  ): Promise<{ inviteToken: string; inviteCode: string }> {
    const group = this.familyGroups.get(groupId)
    if (!group) throw new Error("Family group not found")

    if (group.adminAddress !== adminAddress) {
      throw new Error("Only admin can invite members")
    }

    // Verificar que el miembro no esté ya en el grupo
    const existingMember = group.members.find((m) => 
      m.email === memberEmail || m.ensName === memberEmail
    )
    
    if (existingMember) {
      throw new Error(`Member with email/ENS '${memberEmail}' is already in this group`)
    }

    const inviteToken = Math.random().toString(36).substr(2, 12)
    
    const newMember: FamilyMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      address: null, // Sin dirección hasta que se conecte
      ensName: memberEmail.endsWith('.eth') ? memberEmail : undefined,
      email: memberEmail.endsWith('.eth') ? undefined : memberEmail,
      name: memberName,
      role: "member",
      canWithdraw: permissions.canWithdraw,
      canReceive: permissions.canReceive,
      addedAt: new Date().toISOString(),
      addedBy: adminAddress,
      status: "invited", // Estado inicial: invitado
      inviteToken,
    }

    group.members.push(newMember)
    this.familyGroups.set(groupId, group)

    // Guardar la invitación pendiente
    this.pendingInvites.set(inviteToken, {
      groupId,
      memberData: newMember
    })

    console.log(`[INVITE_MEMBER] Miembro invitado: ${memberName} (${memberEmail})`)
    console.log(`[INVITE_MEMBER] Token de invitación: ${inviteToken}`)

    return { inviteToken, inviteCode: group.inviteCode }
  }

  // Agregar miembro directamente con wallet
  async addFamilyMember(
    groupId: string,
    ensName: string,
    memberName: string,
    walletAddress: string,
    adminAddress: string,
    permissions: { canWithdraw: boolean; canReceive: boolean },
  ): Promise<FamilyMember> {
    const group = this.familyGroups.get(groupId)
    if (!group) throw new Error("Family group not found")

    if (group.adminAddress !== adminAddress) {
      throw new Error("Only admin can add members")
    }

    // Verificar que el miembro no esté ya en el grupo
    const existingMember = group.members.find((m) => 
      m.ensName === ensName || m.address === walletAddress
    )
    
    if (existingMember) {
      throw new Error(`Member with ENS '${ensName}' or wallet '${walletAddress}' is already in this group`)
    }

    const newMember: FamilyMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      address: walletAddress, // Dirección de wallet directamente
      ensName: ensName,
      name: memberName,
      role: "member",
      canWithdraw: permissions.canWithdraw,
      canReceive: permissions.canReceive,
      addedAt: new Date().toISOString(),
      addedBy: adminAddress,
      status: "active", // Estado activo inmediatamente
      inviteToken: "", // Sin token de invitación
    }

    group.members.push(newMember)
    this.familyGroups.set(groupId, group)

    console.log(`[ADD_MEMBER] Miembro agregado: ${memberName} (${ensName})`)
    console.log(`[ADD_MEMBER] Wallet: ${walletAddress}`)

    return newMember
  }

  // Aceptar invitación y conectar wallet
  async acceptInvitation(
    inviteToken: string,
    walletAddress: string,
    memberName?: string
  ): Promise<FamilyMember> {
    const invite = this.pendingInvites.get(inviteToken)
    if (!invite) {
      throw new Error("Invalid or expired invitation token")
    }

    const group = this.familyGroups.get(invite.groupId)
    if (!group) {
      throw new Error("Family group not found")
    }

    const member = group.members.find((m) => m.inviteToken === inviteToken)
    if (!member) {
      throw new Error("Member not found")
    }

    // Actualizar el miembro con su wallet real
    member.address = walletAddress
    member.status = "active"
    member.name = memberName || member.name
    member.inviteToken = "" // Limpiar token usado

    // Remover la invitación pendiente
    this.pendingInvites.delete(inviteToken)

    this.familyGroups.set(invite.groupId, group)

    console.log(`[ACCEPT_INVITATION] Miembro ${member.name} aceptó invitación`)
    console.log(`[ACCEPT_INVITATION] Wallet conectada: ${walletAddress}`)

    return member
  }

  // Get family groups for an address
  getFamilyGroupsForAddress(address: string): FamilyGroup[] {
    return Array.from(this.familyGroups.values()).filter((group) =>
      group.members.some((member) => member.address === address),
    )
  }

  // Get family group by ID
  getFamilyGroup(groupId: string): FamilyGroup | null {
    return this.familyGroups.get(groupId) || null
  }

  // Get pending invites for an email/ENS
  getPendingInvites(emailOrEns: string): Array<{ group: FamilyGroup; member: FamilyMember }> {
    const invites: Array<{ group: FamilyGroup; member: FamilyMember }> = []
    
    for (const group of this.familyGroups.values()) {
      const member = group.members.find(m => 
        (m.email === emailOrEns || m.ensName === emailOrEns) && m.status === "invited"
      )
      if (member) {
        invites.push({ group, member })
      }
    }
    
    return invites
  }

  // Remove member from family group
  async removeFamilyMember(groupId: string, memberAddress: string, adminAddress: string): Promise<void> {
    const group = this.familyGroups.get(groupId)
    if (!group) throw new Error("Family group not found")

    if (group.adminAddress !== adminAddress) {
      throw new Error("Only admin can remove members")
    }

    if (memberAddress === adminAddress) {
      throw new Error("Admin cannot remove themselves")
    }

    group.members = group.members.filter((member) => member.address !== memberAddress)
    this.familyGroups.set(groupId, group)

    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  // Update member permissions
  async updateMemberPermissions(
    groupId: string,
    memberAddress: string,
    adminAddress: string,
    permissions: { canWithdraw: boolean; canReceive: boolean },
  ): Promise<void> {
    const group = this.familyGroups.get(groupId)
    if (!group) throw new Error("Family group not found")

    if (group.adminAddress !== adminAddress) {
      throw new Error("Only admin can update permissions")
    }

    const member = group.members.find((m) => m.address === memberAddress)
    if (!member) throw new Error("Member not found")

    member.canWithdraw = permissions.canWithdraw
    member.canReceive = permissions.canReceive

    this.familyGroups.set(groupId, group)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  // Check if address can withdraw from group
  canWithdrawFromGroup(groupId: string, address: string): boolean {
    const group = this.familyGroups.get(groupId)
    if (!group) return false

    const member = group.members.find((m) => m.address === address)
    return member ? member.canWithdraw && member.status === "active" : false
  }

  // Check if address can receive for group
  canReceiveForGroup(groupId: string, address: string): boolean {
    const group = this.familyGroups.get(groupId)
    if (!group) return false

    const member = group.members.find((m) => m.address === address)
    return member ? member.canReceive && member.status === "active" : false
  }

  // Get all active members who can receive for a group
  getReceivingMembers(groupId: string): FamilyMember[] {
    const group = this.familyGroups.get(groupId)
    if (!group) return []

    return group.members.filter((member) => member.canReceive && member.status === "active")
  }

  // Get all groups (for debugging)
  getAllGroups(): FamilyGroup[] {
    return Array.from(this.familyGroups.values())
  }

  // Clean duplicate members from a group
  cleanDuplicateMembers(groupId: string): void {
    const group = this.familyGroups.get(groupId)
    if (!group) return

    console.log(`[CLEAN] Limpiando duplicados del grupo ${groupId}`)
    console.log(`[CLEAN] Miembros antes de limpiar:`, group.members.length)

    // Crear un Map para mantener solo la primera ocurrencia de cada email/ENS
    const uniqueMembers = new Map<string, FamilyMember>()
    
    group.members.forEach(member => {
      const key = member.email || member.ensName || member.address
      if (key && !uniqueMembers.has(key)) {
        uniqueMembers.set(key, member)
        console.log(`[CLEAN] Manteniendo miembro: ${member.name} (${key})`)
      } else if (key) {
        console.log(`[CLEAN] Eliminando duplicado: ${member.name} (${key})`)
      }
    })

    // Actualizar el grupo con miembros únicos
    group.members = Array.from(uniqueMembers.values())
    this.familyGroups.set(groupId, group)

    console.log(`[CLEAN] Miembros después de limpiar:`, group.members.length)
  }
}
