"use client"

import { ENSService } from "./ens-service"

export interface FamilyRemittance {
  id: string
  groupId: string
  senderAddress: string
  amount: string
  currency: "USDC" | "USD"
  status: "pending" | "deposited" | "withdrawn" | "expired"
  targetMember?: string // Specific member address, or undefined for group pool
  createdAt: string
  expiresAt: string
  transactionHash?: string
  withdrawnBy?: string
  withdrawnAt?: string
}

export interface ContractEvent {
  id: string
  type: "deposit" | "withdrawal" | "member_added" | "member_removed" | "permissions_updated"
  groupId: string
  address: string
  amount?: string
  timestamp: string
  transactionHash: string
  metadata?: Record<string, any>
}

export class FamilyContractService {
  private static instance: FamilyContractService
  private remittances: Map<string, FamilyRemittance> = new Map()
  private events: ContractEvent[] = []
  private ensService: ENSService

  constructor() {
    this.ensService = ENSService.getInstance()
  }

  static getInstance(): FamilyContractService {
    if (!FamilyContractService.instance) {
      FamilyContractService.instance = new FamilyContractService()
    }
    return FamilyContractService.instance
  }

  // Deploy family group contract (simulated)
  async deployFamilyContract(adminAddress: string, groupName: string): Promise<string> {
    // Simulate contract deployment time
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`

    // Log deployment event
    this.logEvent({
      type: "deposit", // Using deposit as generic contract event
      groupId: contractAddress,
      address: adminAddress,
      timestamp: new Date().toISOString(),
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      metadata: { action: "contract_deployed", groupName },
    })

    return contractAddress
  }

  // Send remittance to family group
  async sendToFamilyGroup(
    senderAddress: string,
    groupId: string,
    amount: string,
    targetMemberAddress?: string,
  ): Promise<FamilyRemittance> {
    const group = this.ensService.getFamilyGroup(groupId)
    if (!group) throw new Error("Family group not found")

    // Validate target member if specified
    if (targetMemberAddress) {
      const targetMember = group.members.find((m) => m.address === targetMemberAddress)
      if (!targetMember) throw new Error("Target member not found in group")
      if (!targetMember.canReceive) throw new Error("Target member cannot receive funds")
    }

    const remittanceId = `rem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`

    const remittance: FamilyRemittance = {
      id: remittanceId,
      groupId,
      senderAddress,
      amount,
      currency: "USDC",
      status: "pending",
      targetMember: targetMemberAddress,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      transactionHash,
    }

    this.remittances.set(remittanceId, remittance)

    // Log deposit event
    this.logEvent({
      type: "deposit",
      groupId,
      address: senderAddress,
      amount,
      timestamp: new Date().toISOString(),
      transactionHash,
      metadata: {
        remittanceId,
        targetMember: targetMemberAddress,
        isGroupDeposit: !targetMemberAddress,
      },
    })

    // Simulate blockchain confirmation time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update status to deposited
    remittance.status = "deposited"
    this.remittances.set(remittanceId, remittance)

    return remittance
  }

  // Withdraw remittance from family group
  async withdrawFromFamilyGroup(
    remittanceId: string,
    withdrawerAddress: string,
  ): Promise<{ success: boolean; transactionHash: string }> {
    const remittance = this.remittances.get(remittanceId)
    if (!remittance) throw new Error("Remittance not found")

    if (remittance.status !== "deposited") {
      throw new Error(`Cannot withdraw remittance with status: ${remittance.status}`)
    }

    const group = this.ensService.getFamilyGroup(remittance.groupId)
    if (!group) throw new Error("Family group not found")

    // Check permissions
    const member = group.members.find((m) => m.address === withdrawerAddress)
    if (!member) throw new Error("Address is not a member of this family group")

    if (!member.canWithdraw) {
      throw new Error("Member does not have withdrawal permissions")
    }

    // If remittance is targeted to specific member, only that member can withdraw
    if (remittance.targetMember && remittance.targetMember !== withdrawerAddress) {
      throw new Error("This remittance is targeted to a specific family member")
    }

    // Check expiration
    if (new Date() > new Date(remittance.expiresAt)) {
      remittance.status = "expired"
      this.remittances.set(remittanceId, remittance)
      throw new Error("Remittance has expired")
    }

    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`

    // Update remittance status
    remittance.status = "withdrawn"
    remittance.withdrawnBy = withdrawerAddress
    remittance.withdrawnAt = new Date().toISOString()
    this.remittances.set(remittanceId, remittance)

    // Log withdrawal event
    this.logEvent({
      type: "withdrawal",
      groupId: remittance.groupId,
      address: withdrawerAddress,
      amount: remittance.amount,
      timestamp: new Date().toISOString(),
      transactionHash,
      metadata: { remittanceId, withdrawnBy: member.ensName || member.name },
    })

    // Simulate blockchain transaction time
    await new Promise((resolve) => setTimeout(resolve, 2500))

    return { success: true, transactionHash }
  }

  // Get remittances for a family group
  getGroupRemittances(groupId: string): FamilyRemittance[] {
    return Array.from(this.remittances.values())
      .filter((r) => r.groupId === groupId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Get remittances available for withdrawal by an address
  getWithdrawableRemittances(address: string): FamilyRemittance[] {
    const userGroups = this.ensService.getFamilyGroupsForAddress(address)
    const withdrawableRemittances: FamilyRemittance[] = []

    for (const group of userGroups) {
      const member = group.members.find((m) => m.address === address)
      if (!member || !member.canWithdraw) continue

      const groupRemittances = this.getGroupRemittances(group.id)

      for (const remittance of groupRemittances) {
        if (remittance.status !== "deposited") continue
        if (new Date() > new Date(remittance.expiresAt)) continue

        // If targeted to specific member, only that member can withdraw
        if (remittance.targetMember && remittance.targetMember !== address) continue

        withdrawableRemittances.push(remittance)
      }
    }

    return withdrawableRemittances
  }

  // Get remittances sent to a specific member
  getTargetedRemittances(address: string): FamilyRemittance[] {
    return Array.from(this.remittances.values())
      .filter((r) => r.targetMember === address && r.status === "deposited")
      .filter((r) => new Date() <= new Date(r.expiresAt))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Get contract events for a group
  getGroupEvents(groupId: string, limit = 50): ContractEvent[] {
    return this.events
      .filter((e) => e.groupId === groupId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  // Get group statistics
  getGroupStats(groupId: string): {
    totalDeposited: number
    totalWithdrawn: number
    pendingAmount: number
    transactionCount: number
    activeRemittances: number
  } {
    const remittances = this.getGroupRemittances(groupId)

    const totalDeposited = remittances
      .filter((r) => r.status !== "pending")
      .reduce((sum, r) => sum + Number.parseFloat(r.amount), 0)

    const totalWithdrawn = remittances
      .filter((r) => r.status === "withdrawn")
      .reduce((sum, r) => sum + Number.parseFloat(r.amount), 0)

    const pendingAmount = remittances
      .filter((r) => r.status === "deposited")
      .reduce((sum, r) => sum + Number.parseFloat(r.amount), 0)

    const activeRemittances = remittances.filter(
      (r) => r.status === "deposited" && new Date() <= new Date(r.expiresAt),
    ).length

    return {
      totalDeposited,
      totalWithdrawn,
      pendingAmount,
      transactionCount: remittances.length,
      activeRemittances,
    }
  }

  // Check if remittance can be withdrawn by address
  canWithdrawRemittance(remittanceId: string, address: string): boolean {
    const remittance = this.remittances.get(remittanceId)
    if (!remittance || remittance.status !== "deposited") return false

    if (new Date() > new Date(remittance.expiresAt)) return false

    const group = this.ensService.getFamilyGroup(remittance.groupId)
    if (!group) return false

    const member = group.members.find((m) => m.address === address)
    if (!member || !member.canWithdraw) return false

    // If targeted to specific member, only that member can withdraw
    if (remittance.targetMember && remittance.targetMember !== address) return false

    return true
  }

  // Private method to log events
  private logEvent(event: Omit<ContractEvent, "id">): void {
    const eventWithId: ContractEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...event,
    }
    this.events.push(eventWithId)

    // Keep only last 1000 events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000)
    }
  }

  // Get remittance by ID
  getRemittance(remittanceId: string): FamilyRemittance | null {
    return this.remittances.get(remittanceId) || null
  }

  // Expire old remittances (cleanup function)
  expireOldRemittances(): number {
    let expiredCount = 0
    const now = new Date()

    for (const [id, remittance] of this.remittances.entries()) {
      if (remittance.status === "deposited" && now > new Date(remittance.expiresAt)) {
        remittance.status = "expired"
        this.remittances.set(id, remittance)
        expiredCount++
      }
    }

    return expiredCount
  }
}
