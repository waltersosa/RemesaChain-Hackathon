"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Building2, CheckCircle, AlertCircle } from "lucide-react"
import { useWallet } from "./wallet-provider"
import { useLanguage } from "./language-provider"

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

interface BankingIdentityManagerProps {
  onAccountSelect?: (account: BankAccount) => void
  selectedAccountId?: string
}

export function BankingIdentityManager({ onAccountSelect, selectedAccountId }: BankingIdentityManagerProps) {
  const { address } = useWallet()
  const { t } = useLanguage()
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: "acc_001",
      bankName: "Banco Pichincha",
      accountNumber: "2100123456",
      accountType: "savings",
      accountHolderName: "Juan Carlos Pérez",
      accountHolderCedula: "1234567890",
      isVerified: true,
      isPrimary: true,
    },
  ])

  const [isAddingAccount, setIsAddingAccount] = useState(false)
  const [editingAccount, setEditingAccount] = useState<string | null>(null)
  const [newAccount, setNewAccount] = useState<Partial<BankAccount>>({
    bankName: "",
    accountNumber: "",
    accountType: "savings",
    accountHolderName: "",
    accountHolderCedula: "",
  })

  const ecuadorianBanks = [
    "Banco Pichincha",
    "Banco del Pacífico",
    "Banco de Guayaquil",
    "Banco Internacional",
    "Banco Bolivariano",
    "Banco ProCredit",
    "Banco General Rumiñahui",
    "Banco Solidario",
    "Banco Machala",
    "Banco Loja",
    "Banco Coopnacional",
    "Banco Finca",
    "Banco D-MIRO",
    "Banco Litoral",
    "Banco del Austro",
  ]

  const handleAddAccount = () => {
    if (
      !newAccount.bankName ||
      !newAccount.accountNumber ||
      !newAccount.accountHolderName ||
      !newAccount.accountHolderCedula
    ) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    const account: BankAccount = {
      id: `acc_${Date.now()}`,
      bankName: newAccount.bankName!,
      accountNumber: newAccount.accountNumber!,
      accountType: newAccount.accountType as "savings" | "checking",
      accountHolderName: newAccount.accountHolderName!,
      accountHolderCedula: newAccount.accountHolderCedula!,
      isVerified: false,
      isPrimary: accounts.length === 0,
    }

    setAccounts([...accounts, account])
    setNewAccount({
      bankName: "",
      accountNumber: "",
      accountType: "savings",
      accountHolderName: "",
      accountHolderCedula: "",
    })
    setIsAddingAccount(false)

    console.log("[v0] New bank account added:", {
      ...account,
      walletAddress: address,
      timestamp: new Date().toISOString(),
    })
  }

  const handleDeleteAccount = (accountId: string) => {
    if (accounts.length === 1) {
      alert("No puedes eliminar tu única cuenta bancaria")
      return
    }

    const updatedAccounts = accounts.filter((acc) => acc.id !== accountId)

    // If we deleted the primary account, make the first remaining account primary
    if (accounts.find((acc) => acc.id === accountId)?.isPrimary) {
      updatedAccounts[0].isPrimary = true
    }

    setAccounts(updatedAccounts)
  }

  const handleSetPrimary = (accountId: string) => {
    setAccounts(
      accounts.map((acc) => ({
        ...acc,
        isPrimary: acc.id === accountId,
      })),
    )
  }

  const handleVerifyAccount = (accountId: string) => {
    // Simulate verification process
    setAccounts(accounts.map((acc) => (acc.id === accountId ? { ...acc, isVerified: true } : acc)))

    console.log("[v0] Account verification initiated:", accountId)
  }

  const validateCedula = (cedula: string) => {
    // Basic Ecuador cedula validation (simplified)
    return cedula.length === 10 && /^\d+$/.test(cedula)
  }

  const validateAccountNumber = (accountNumber: string, bankName: string) => {
    // Basic account number validation (simplified)
    return accountNumber.length >= 8 && accountNumber.length <= 20 && /^\d+$/.test(accountNumber)
  }

  return (
    <div className="space-y-6">
      {/* Existing Accounts */}
      <div>
                        <h3 className="text-lg font-semibold mb-4">{t("banking.accounts.title")}</h3>
        {accounts.length > 0 ? (
          <div className="space-y-3">
            {accounts.map((account) => (
              <Card
                key={account.id}
                className={`cursor-pointer transition-all ${
                  selectedAccountId === account.id ? "ring-2 ring-primary border-primary" : "hover:shadow-md"
                } ${account.isPrimary ? "border-l-4 border-l-primary" : ""}`}
                onClick={() => onAccountSelect?.(account)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h4 className="font-medium">{account.bankName}</h4>
                      {account.isPrimary && (
                        <Badge variant="secondary" className="text-xs">
                          Principal
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {account.isVerified ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verificada
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pendiente
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Número de cuenta</p>
                      <p className="font-mono">{account.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tipo</p>
                      <p className="capitalize">{account.accountType === "savings" ? "Ahorros" : "Corriente"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Titular</p>
                      <p>{account.accountHolderName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cédula</p>
                      <p className="font-mono">{account.accountHolderCedula}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    {!account.isVerified && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVerifyAccount(account.id)
                        }}
                      >
                        Verificar cuenta
                      </Button>
                    )}
                    {!account.isPrimary && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSetPrimary(account.id)
                        }}
                      >
                        Hacer principal
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteAccount(account.id)
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">{t("banking.accounts.empty")}</p>
          </div>
        )}
      </div>

      {/* Add New Account */}
      <div>
        {!isAddingAccount ? (
          <Button onClick={() => setIsAddingAccount(true)} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Agregar nueva cuenta bancaria
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Agregar Nueva Cuenta Bancaria</CardTitle>
              <CardDescription>Completa la información de tu cuenta bancaria ecuatoriana</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Banco *</Label>
                  <Select onValueChange={(value) => setNewAccount({ ...newAccount, bankName: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {ecuadorianBanks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accountType">Tipo de cuenta *</Label>
                  <Select
                    value={newAccount.accountType}
                    onValueChange={(value) =>
                      setNewAccount({ ...newAccount, accountType: value as "savings" | "checking" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Ahorros</SelectItem>
                      <SelectItem value="checking">Corriente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="accountNumber">Número de cuenta *</Label>
                <Input
                  id="accountNumber"
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                  placeholder="1234567890"
                  className={
                    newAccount.accountNumber &&
                    !validateAccountNumber(newAccount.accountNumber, newAccount.bankName || "")
                      ? "border-destructive"
                      : ""
                  }
                />
                {newAccount.accountNumber &&
                  !validateAccountNumber(newAccount.accountNumber, newAccount.bankName || "") && (
                    <p className="text-sm text-destructive mt-1">Número de cuenta inválido</p>
                  )}
              </div>

              <div>
                <Label htmlFor="accountHolderName">Nombre del titular *</Label>
                <Input
                  id="accountHolderName"
                  value={newAccount.accountHolderName}
                  onChange={(e) => setNewAccount({ ...newAccount, accountHolderName: e.target.value })}
                  placeholder="Juan Carlos Pérez"
                />
              </div>

              <div>
                <Label htmlFor="accountHolderCedula">Cédula del titular *</Label>
                <Input
                  id="accountHolderCedula"
                  value={newAccount.accountHolderCedula}
                  onChange={(e) => setNewAccount({ ...newAccount, accountHolderCedula: e.target.value })}
                  placeholder="1234567890"
                  className={
                    newAccount.accountHolderCedula && !validateCedula(newAccount.accountHolderCedula)
                      ? "border-destructive"
                      : ""
                  }
                />
                {newAccount.accountHolderCedula && !validateCedula(newAccount.accountHolderCedula) && (
                  <p className="text-sm text-destructive mt-1">Cédula inválida (debe tener 10 dígitos)</p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Verificación requerida</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Después de agregar tu cuenta, necesitarás verificarla proporcionando documentos adicionales para
                      poder recibir depósitos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddAccount} className="flex-1">
                  Agregar cuenta
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingAccount(false)
                    setNewAccount({
                      bankName: "",
                      accountNumber: "",
                      accountType: "savings",
                      accountHolderName: "",
                      accountHolderCedula: "",
                    })
                  }}
                >
                  {t("common.cancel")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Verification Info */}
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Proceso de verificación</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Las cuentas nuevas requieren verificación antes de recibir depósitos</li>
          <li>• El proceso toma 1-2 días hábiles</li>
          <li>• Necesitarás proporcionar una foto de tu cédula y un estado de cuenta</li>
          <li>• Solo puedes recibir depósitos en cuentas a tu nombre</li>
        </ul>
      </div>
    </div>
  )
}
