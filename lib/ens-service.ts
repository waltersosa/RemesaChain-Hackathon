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
  ensName: string
  adminAddress: string
  adminName: string
  members: FamilyMember[]
  contractAddress: string
  createdAt: string
  isActive: boolean
}

export interface FamilyMember {
  id: string
  address: string
  ensName?: string
  name: string
  role: "admin" | "member"
  canWithdraw: boolean
  canReceive: boolean
  addedAt: string
  addedBy: string
}

export class ENSService {
  private static instance: ENSService
  private familyGroups: Map<string, FamilyGroup> = new Map()

  static getInstance(): ENSService {
    if (!ENSService.instance) {
      ENSService.instance = new ENSService()
    }
    return ENSService.instance
  }

  // Simulate ENS resolution
  async resolveENS(ensName: string): Promise<ENSProfile | null> {
    // Mock ENS resolution - in production this would call ENS contracts
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

    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay
    return mockProfiles[ensName] || null
  }

  // Reverse ENS lookup
  async reverseResolveENS(address: string): Promise<string | null> {
    const mockReverse: Record<string, string> = {
      "0x1234567890123456789012345678901234567890": "maria.eth",
      "0x2345678901234567890123456789012345678901": "carlos.eth",
      "0x3456789012345678901234567890123456789012": "ana.eth",
    }

    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockReverse[address] || null
  }

  // Create a new family group
  async createFamilyGroup(adminAddress: string, groupName: string, ensName: string): Promise<FamilyGroup> {
    const groupId = `family_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`

    const adminProfile = await this.resolveENS(ensName)

    const familyGroup: FamilyGroup = {
      id: groupId,
      name: groupName,
      ensName,
      adminAddress,
      adminName: adminProfile?.name || ensName,
      members: [
        {
          id: `member_${Date.now()}`,
          address: adminAddress,
          ensName,
          name: adminProfile?.name || ensName,
          role: "admin",
          canWithdraw: true,
          canReceive: true,
          addedAt: new Date().toISOString(),
          addedBy: adminAddress,
        },
      ],
      contractAddress,
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    this.familyGroups.set(groupId, familyGroup)

    // Simulate smart contract deployment
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return familyGroup
  }

  // Add member to family group
  async addFamilyMember(
    groupId: string,
    memberEnsName: string,
    adminAddress: string,
    permissions: { canWithdraw: boolean; canReceive: boolean },
  ): Promise<FamilyMember> {
    const group = this.familyGroups.get(groupId)
    if (!group) throw new Error("Family group not found")

    if (group.adminAddress !== adminAddress) {
      throw new Error("Only admin can add members")
    }

    const memberProfile = await this.resolveENS(memberEnsName)
    if (!memberProfile) throw new Error("ENS name not found")

    // Check if member already exists
    const existingMember = group.members.find((m) => m.address === memberProfile.address)
    if (existingMember) throw new Error("Member already in group")

    const newMember: FamilyMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      address: memberProfile.address,
      ensName: memberEnsName,
      name: memberProfile.name,
      role: "member",
      canWithdraw: permissions.canWithdraw,
      canReceive: permissions.canReceive,
      addedAt: new Date().toISOString(),
      addedBy: adminAddress,
    }

    group.members.push(newMember)
    this.familyGroups.set(groupId, group)

    // Simulate smart contract transaction
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return newMember
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

    // Simulate smart contract transaction
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

    // Simulate smart contract transaction
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  // Check if address can withdraw from group
  canWithdrawFromGroup(groupId: string, address: string): boolean {
    const group = this.familyGroups.get(groupId)
    if (!group) return false

    const member = group.members.find((m) => m.address === address)
    return member ? member.canWithdraw : false
  }

  // Check if address can receive for group
  canReceiveForGroup(groupId: string, address: string): boolean {
    const group = this.familyGroups.get(groupId)
    if (!group) return false

    const member = group.members.find((m) => m.address === address)
    return member ? member.canReceive : false
  }

  // Get all members who can receive for a group
  getReceivingMembers(groupId: string): FamilyMember[] {
    const group = this.familyGroups.get(groupId)
    if (!group) return []

    return group.members.filter((member) => member.canReceive)
  }
}
