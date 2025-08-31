"use client"

import { useToast } from "./use-toast"
import { CheckCircle, AlertCircle, Info, AlertTriangle, Copy, Users, Wallet, Shield } from "lucide-react"

export function useNotifications() {
  const { toast } = useToast()

  const showSuccess = (title: string, description?: string) => {
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {title}
        </div>
      ),
      description,
      duration: 4000,
    })
  }

  const showError = (title: string, description?: string) => {
    toast({
      variant: "destructive",
      title: (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {title}
        </div>
      ),
      description,
      duration: 6000,
    })
  }

  const showInfo = (title: string, description?: string) => {
    toast({
      variant: "info",
      title: (
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          {title}
        </div>
      ),
      description,
      duration: 4000,
    })
  }

  const showWarning = (title: string, description?: string) => {
    toast({
      variant: "warning",
      title: (
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {title}
        </div>
      ),
      description,
      duration: 5000,
    })
  }

  // Notificaciones específicas de RemesaChain
  const showGroupCreated = (groupName: string) => {
    showSuccess(
      "Grupo Familiar Creado",
      `El grupo "${groupName}" se ha creado exitosamente. Ya puedes invitar miembros.`
    )
  }

  const showMemberInvited = (memberName: string, inviteCode: string, inviteToken: string) => {
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Miembro Invitado
        </div>
      ),
      description: (
        <div className="space-y-2">
          <p>{memberName} ha sido invitado al grupo.</p>
          <div className="bg-green-100 p-2 rounded text-xs">
            <p><strong>Código:</strong> {inviteCode}</p>
            <p><strong>Token:</strong> {inviteToken}</p>
          </div>
          <p className="text-xs text-green-700">Comparte esta información con el miembro.</p>
        </div>
      ),
      duration: 8000,
    })
  }

  const showInvitationAccepted = (memberName: string) => {
    showSuccess(
      "Invitación Aceptada",
      `${memberName} se ha unido exitosamente al grupo familiar.`
    )
  }

  const showMemberRemoved = (memberName: string) => {
    showSuccess(
      "Miembro Removido",
      `${memberName} ha sido removido del grupo familiar.`
    )
  }

  const showDuplicatesCleaned = (count: number) => {
    showSuccess(
      "Duplicados Limpiados",
      `Se han eliminado ${count} miembros duplicados del grupo.`
    )
  }

  const showCopiedToClipboard = (text: string) => {
    toast({
      variant: "default",
      title: (
        <div className="flex items-center gap-2">
          <Copy className="h-4 w-4" />
          Copiado al Portapapeles
        </div>
      ),
      description: `${text.slice(0, 20)}...`,
      duration: 2000,
    })
  }

  const showWalletConnected = (address: string) => {
    showSuccess(
      "Wallet Conectada",
      `Tu wallet ${address.slice(0, 6)}...${address.slice(-4)} se ha conectado exitosamente.`
    )
  }

  const showWalletDisconnected = () => {
    showInfo(
      "Wallet Desconectada",
      "Tu wallet se ha desconectado. Conecta una nueva wallet para continuar."
    )
  }

  const showPermissionUpdated = (memberName: string, permissions: string[]) => {
    showSuccess(
      "Permisos Actualizados",
      `Los permisos de ${memberName} se han actualizado: ${permissions.join(", ")}.`
    )
  }

  const showRemittanceSent = (amount: string, recipient: string) => {
    showSuccess(
      "Remesa Enviada",
      `Se ha enviado ${amount} a ${recipient}. La transacción está siendo procesada.`
    )
  }

  const showRemittanceReceived = (amount: string, sender: string) => {
    showSuccess(
      "Remesa Recibida",
      `Has recibido ${amount} de ${sender}. Los fondos están disponibles en tu wallet.`
    )
  }

  const showWithdrawalSuccessful = (amount: string, hash: string) => {
    showSuccess(
      "Retiro Exitoso",
      `Se han retirado ${amount} exitosamente. Hash: ${hash.slice(0, 10)}...`
    )
  }

  const showValidationError = (field: string, message: string) => {
    showError(
      `Error de Validación: ${field}`,
      message
    )
  }

  const showNetworkError = (operation: string) => {
    showError(
      "Error de Red",
      `No se pudo completar la operación: ${operation}. Verifica tu conexión e intenta nuevamente.`
    )
  }

  const showInsufficientFunds = (required: string, available: string) => {
    showWarning(
      "Fondos Insuficientes",
      `Necesitas ${required} pero solo tienes ${available} disponibles.`
    )
  }

  const showPendingTransaction = (operation: string) => {
    showInfo(
      "Transacción Pendiente",
      `${operation} está siendo procesada en la blockchain. Esto puede tomar unos minutos.`
    )
  }

  return {
    // Métodos básicos
    showSuccess,
    showError,
    showInfo,
    showWarning,
    
    // Notificaciones específicas
    showGroupCreated,
    showMemberInvited,
    showInvitationAccepted,
    showMemberRemoved,
    showDuplicatesCleaned,
    showCopiedToClipboard,
    showWalletConnected,
    showWalletDisconnected,
    showPermissionUpdated,
    showRemittanceSent,
    showRemittanceReceived,
    showWithdrawalSuccessful,
    showValidationError,
    showNetworkError,
    showInsufficientFunds,
    showPendingTransaction,
  }
}
