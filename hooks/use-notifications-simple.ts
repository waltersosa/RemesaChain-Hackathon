"use client"

export function useNotifications() {
  const showGroupCreated = (groupName: string) => {
    console.log(`Grupo creado: ${groupName}`)
  }

  const showMemberAdded = (memberName: string) => {
    console.log(`Miembro agregado: ${memberName}`)
  }

  const showMemberRemoved = (memberName: string) => {
    console.log(`Miembro removido: ${memberName}`)
  }

  const showDuplicatesCleaned = (count: number) => {
    console.log(`Duplicados limpiados: ${count}`)
  }

  const showCopiedToClipboard = (text: string) => {
    console.log(`Copiado: ${text}`)
  }

  const showError = (title: string, description?: string) => {
    console.error(`Error: ${title} - ${description}`)
  }

  return {
    showGroupCreated,
    showMemberAdded,
    showMemberRemoved,
    showDuplicatesCleaned,
    showCopiedToClipboard,
    showError,
  }
}
