"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  es: {
    // Header
    "nav.home": "Inicio",
    "nav.how-it-works": "Cómo funciona",
    "nav.sponsors": "Sponsors",
    "nav.contact": "Contacto",
    "nav.demo": "Enviar una remesa (Demo)",
    "nav.p2p-operator": "Operador P2P",
    "nav.receive": "Recibir remesa",
    "nav.family-groups": "Grupos Familiares",

    // Rates
    "rates.last-update": "Última actualización",
    "rates.live-oracle": "Datos en vivo vía Flare Oracle",
    "rates.current-rate": "Tasa actual",

    // Hero
    "hero.title": "Remesas familiares rápidas y económicas para Ecuador",
    "hero.subtitle":
      "Enviamos dinero con USDC y lo entregamos en USD directo a cuentas bancarias ecuatorianas mediante una red P2P.",
    "hero.demo-btn": "Probar Demo",
    "hero.operator-btn": "Quiero ser operador P2P",

    // Problems
    "problems.title": "Los problemas de las remesas tradicionales",
    "problems.high-fees": "Altas comisiones",
    "problems.high-fees-desc": "8–15% en servicios tradicionales",
    "problems.slow": "Lentos",
    "problems.slow-desc": "2–5 días para completar",
    "problems.exclusion": "Exclusión financiera",
    "problems.exclusion-desc": "Difícil acceso en zonas rurales",

    // Solution
    "solution.title": "La solución RemesaChain",
    "solution.instant": "Remesas instantáneas",
    "solution.instant-desc": "Con USDC en segundos",
    "solution.fixed-fee": "Comisión fija",
    "solution.fixed-fee-desc": "Solo $1 USD por transacción",
    "solution.p2p-network": "Red P2P local",
    "solution.p2p-network-desc": "Depósito directo en USD sin conocer cripto",

    // Forms
    "form.operator.title": "Quiero ser operador P2P",
    "form.operator.subtitle": "Ayuda a las familias ecuatorianas y gana comisiones por cada transacción",
    "form.operator.name": "Nombre completo",
    "form.operator.bank": "Banco principal",
    "form.operator.volume": "Volumen mensual estimado (USD)",
    "form.operator.contact": "Contacto (WhatsApp/Email)",
    "form.operator.submit": "Aplicar como operador P2P",

    "form.sponsor.title": "Soy sponsor interesado",
    "form.sponsor.subtitle": "Apoya el desarrollo de RemesaChain y el impacto social en Ecuador",
    "form.sponsor.organization": "Organización",
    "form.sponsor.contact": "Contacto",
    "form.sponsor.message": "Mensaje",
    "form.sponsor.submit": "Contactar como sponsor",

    // Demo
    "demo.send.title": "Enviar Remesa",
    "demo.send.wallet": "Dirección de tu wallet",
    "demo.send.recipient": "Dirección del destinatario",
    "demo.send.amount": "Cantidad (USDC)",
    "demo.send.submit": "Enviar Remesa",

    "demo.receive.title": "Recibir Remesa",
    "demo.receive.wallet": "Tu dirección de wallet",
    "demo.receive.pending": "Remesas pendientes",
    "demo.receive.bank": "Banco de destino",
    "demo.receive.account": "Número de cuenta",
    "demo.receive.submit": "Confirmar recepción",

    // Demo Page
    "demo.page.title": "Demo de Remesas",
    "demo.page.subtitle": "Prueba el flujo completo de envío y recepción de remesas",
    
    // Demo Tabs
    "demo.tabs.send": "Enviar Remesa",
    "demo.tabs.receive": "Recibir Remesas",
    "demo.tabs.banking": "Identidad Bancaria",
    
    // Demo Send Section
    "demo.send.description": "Envía USDC a cualquier dirección o grupo familiar",
    "demo.send.recipient.address": "Dirección del destinatario",
    "demo.send.recipient.name": "Nombre del destinatario",
    "demo.send.recipient.phone": "Teléfono del destinatario",
    "demo.send.purpose": "Propósito de la remesa",
    "demo.send.family.group": "Enviar a grupo familiar ENS",
    "demo.send.family.select": "Seleccionar grupo familiar",
    "demo.send.family.select.placeholder": "Selecciona un grupo familiar",
    "demo.send.family.target": "Destinatario específico (opcional)",
    "demo.send.family.target.placeholder": "Enviar a todo el grupo",
    "demo.send.family.target.all": "Todo el grupo (cualquiera puede retirar)",
    "demo.send.family.info": "Enviando a grupo familiar:",
    "demo.send.submit.family": "Enviar a Grupo Familiar",
    "demo.send.submitting": "Enviando remesa...",
    "demo.send.submitting.family": "Enviando a grupo familiar...",
    "demo.send.another": "Enviar otra remesa",
    "demo.send.success.title": "¡Remesa Enviada!",
    "demo.send.success.family": "Tu remesa ha sido enviada al grupo familiar y está disponible para retiro",
    "demo.send.success.regular": "Tu remesa ha sido enviada al escrow y está siendo procesada",
    "demo.send.transaction.hash": "Hash de transacción",
    "demo.send.transaction.summary": "Resumen de la transacción",
    "demo.send.ftso.price": "Precio FTSO",
    "demo.send.amount.to.send": "Cantidad a enviar",
    "demo.send.gross.value": "Valor bruto (Flare FTSO)",
    "demo.send.network.fee": "Comisión de red",
    "demo.send.platform.fee": "Comisión RemesaChain",
    "demo.send.recipient.will.receive": "El destinatario recibirá",
    "demo.send.available.for.withdrawal": "Disponible para retiro",
    
    // Demo Receive Section
    "demo.receive.description": "Revisa las remesas pendientes para tu dirección de wallet",
    "demo.receive.wallet.address": "Tu dirección de wallet:",
    "demo.receive.pending.title": "Remesas pendientes:",
    "demo.receive.pending.empty": "No tienes remesas pendientes en este momento",
    "demo.receive.configure": "Configurar recepción bancaria",
    "demo.receive.matched": "✓ Emparejado con operador P2P. Selecciona tu cuenta bancaria para el depósito.",
    "demo.receive.selected.account": "Cuenta seleccionada:",
    "demo.receive.confirm.deposit": "Confirmar depósito y generar voucher",
    
    // Demo Banking Section
    "demo.banking.title": "Identidad Bancaria",
    "demo.banking.description": "Configura tus cuentas bancarias para recibir depósitos en USD",
    
    // Demo Info Messages
    "demo.info.rates": "💡 Precios actualizados cada 30 segundos desde oráculos Flare (FTSO)",
    "demo.info.family.sending": "🏠 Enviando a grupo familiar:",
    
    // Demo Family Flow Info
    "demo.family.flow.available": "• La remesa está disponible en el contrato del grupo familiar",
    "demo.family.flow.withdraw": "• Los miembros autorizados pueden retirar los fondos",
    "demo.family.flow.expires": "• Los fondos expiran en 7 días si no son retirados",
    "demo.family.flow.p2p": "• La remesa será emparejada con un operador P2P",
    "demo.family.flow.deposit": "• El operador depositará USD en la cuenta del destinatario",
    "demo.family.flow.time": "• El proceso completo toma entre 5-15 minutos",
    
    // Demo Warning
    "demo.warning.title": "Demo Mode",
    "demo.warning.description": "Este es un demo funcional. No se procesan transacciones reales de blockchain ni dinero. Todas las operaciones son simuladas para propósitos de demostración.",
    
    // Voucher Modal
    "voucher.title": "✓ Depósito Confirmado",
    "voucher.download": "Descargar Voucher",
    "voucher.close": "Cerrar",

    // Common
    "common.loading": "Cargando...",
    "common.success": "Éxito",
    "common.error": "Error",
    "common.connect-wallet": "Conectar Wallet",
    "common.wallet-connected": "Wallet Conectada",
    "common.back": "Volver",
    "common.back-home": "Volver al inicio",
    "common.cancel": "Cancelar",

    // Operator Registration
    "operator.title": "Registro de Operador P2P",
    "operator.subtitle": "Únete a nuestra red de operadores y ayuda a las familias ecuatorianas",
    "operator.benefits.title": "Beneficios del Operador P2P",
    "operator.benefits.commissions": "Ingresos por comisiones",
    "operator.benefits.commissions-desc": "Gana hasta 0.5% por cada transacción procesada",
    "operator.benefits.social": "Impacto social",
    "operator.benefits.social-desc": "Ayuda a familias ecuatorianas con remesas más baratas",
    "operator.benefits.security": "Seguridad garantizada",
    "operator.benefits.security-desc": "Sistema de escrow protege todas las transacciones",

    "operator.form.personal": "Información Personal",
    "operator.form.banking": "Información Bancaria",
    "operator.form.operational": "Información Operativa",
    "operator.form.wallet": "Información de Wallet",
    "operator.form.terms": "Términos y Condiciones",

    "operator.success.title": "¡Registro Exitoso!",
    "operator.success.subtitle": "Tu solicitud para ser operador P2P ha sido enviada",
    "operator.success.message": "Hemos recibido tu solicitud y la revisaremos en las próximas 24-48 horas.",

    // Family Groups
    "family.title": "Grupos Familiares ENS",
    "family.subtitle": "Gestiona grupos familiares con identidades ENS para remesas compartidas",
    "family.create.title": "Crear Grupo Familiar",
    "family.create.name": "Nombre del grupo",
    "family.create.ens": "Tu nombre ENS",
    "family.create.submit": "Crear Grupo",
    "family.create.success": "Grupo familiar creado exitosamente",

    "family.manage.title": "Gestionar Grupo",
    "family.manage.members": "Miembros",
    "family.manage.stats": "Estadísticas",
    "family.manage.transactions": "Transacciones",
    "family.manage.add-member": "Agregar Miembro",

    "family.member.add.title": "Agregar Miembro Familiar",
    "family.member.add.ens": "Nombre ENS del miembro",
    "family.member.add.permissions": "Permisos",
    "family.member.add.can-withdraw": "Puede retirar fondos",
    "family.member.add.can-receive": "Puede recibir remesas",
    "family.member.add.submit": "Agregar Miembro",

    "family.stats.total-deposited": "Total Depositado",
    "family.stats.total-withdrawn": "Total Retirado",
    "family.stats.pending-amount": "Monto Pendiente",
    "family.stats.active-remittances": "Remesas Activas",

    "family.remittances.title": "Remesas del Grupo",
    "family.remittances.empty": "No hay remesas en este grupo",
    "family.remittances.withdraw": "Retirar",
    "family.remittances.targeted": "Dirigida a",
    "family.remittances.expires": "Expira",

    "family.no-groups": "No tienes grupos familiares",
    "family.no-groups.desc": "Crea tu primer grupo familiar para comenzar",

    "family.member.role.admin": "Administrador",
    "family.member.role.member": "Miembro",
    "family.member.remove": "Remover",
    "family.member.update": "Actualizar Permisos",

    // Banking Identity
    "banking.title": "Identidad Bancaria",
    "banking.subtitle": "Configura tus cuentas bancarias para recibir depósitos en USD",
    "banking.accounts.title": "Tus Cuentas Bancarias",
    "banking.accounts.empty": "No tienes cuentas bancarias registradas",
    "banking.add.title": "Agregar Cuenta Bancaria",
    "banking.add.bank": "Banco",
    "banking.add.account": "Número de Cuenta",
    "banking.add.type": "Tipo de Cuenta",
    "banking.add.holder": "Titular de la Cuenta",
    "banking.add.cedula": "Cédula del Titular",
    "banking.add.submit": "Agregar Cuenta",
    "banking.add.cancel": "Cancelar",
    "banking.verify": "Verificar",
    "banking.verified": "Verificada",
    "banking.primary": "Principal",
    "banking.remove": "Eliminar",
    "banking.edit": "Editar",
  },
  en: {
    // Header
    "nav.home": "Home",
    "nav.how-it-works": "How it works",
    "nav.sponsors": "Sponsors",
    "nav.contact": "Contact",
    "nav.demo": "Send remittance (Demo)",
    "nav.p2p-operator": "P2P Operator",
    "nav.receive": "Receive remittance",
    "nav.family-groups": "Family Groups",

    // Rates
    "rates.last-update": "Last update",
    "rates.live-oracle": "Live data via Flare Oracle",
    "rates.current-rate": "Current rate",

    // Hero
    "hero.title": "Fast and affordable family remittances to Ecuador",
    "hero.subtitle":
      "We send money with USDC and deliver it in USD directly to Ecuadorian bank accounts through a P2P network.",
    "hero.demo-btn": "Try Demo",
    "hero.operator-btn": "I want to be a P2P operator",

    // Problems
    "problems.title": "Traditional remittance problems",
    "problems.high-fees": "High fees",
    "problems.high-fees-desc": "8–15% in traditional services",
    "problems.slow": "Slow",
    "problems.slow-desc": "2–5 days to complete",
    "problems.exclusion": "Financial exclusion",
    "problems.exclusion-desc": "Difficult access in rural areas",

    // Solution
    "solution.title": "The RemesaChain solution",
    "solution.instant": "Instant remittances",
    "solution.instant-desc": "With USDC in seconds",
    "solution.fixed-fee": "Fixed fee",
    "solution.fixed-fee-desc": "Only $1 USD per transaction",
    "solution.p2p-network": "Local P2P network",
    "solution.p2p-network-desc": "Direct USD deposit without knowing crypto",

    // Forms
    "form.operator.title": "I want to be a P2P operator",
    "form.operator.subtitle": "Help Ecuadorian families and earn commissions for each transaction",
    "form.operator.name": "Full name",
    "form.operator.bank": "Main bank",
    "form.operator.volume": "Estimated monthly volume (USD)",
    "form.operator.contact": "Contact (WhatsApp/Email)",
    "form.operator.submit": "Apply as P2P operator",

    "form.sponsor.title": "I am an interested sponsor",
    "form.sponsor.subtitle": "Support RemesaChain development and social impact in Ecuador",
    "form.sponsor.organization": "Organization",
    "form.sponsor.contact": "Contact",
    "form.sponsor.message": "Message",
    "form.sponsor.submit": "Contact as sponsor",

    // Demo
    "demo.send.title": "Send Remittance",
    "demo.send.wallet": "Your wallet address",
    "demo.send.recipient": "Recipient address",
    "demo.send.amount": "Amount (USDC)",
    "demo.send.submit": "Send Remittance",

    "demo.receive.title": "Receive Remittance",
    "demo.receive.wallet": "Your wallet address",
    "demo.receive.pending": "Pending remittances",
    "demo.receive.bank": "Destination bank",
    "demo.receive.account": "Account number",
    "demo.receive.submit": "Confirm reception",

    // Demo Page
    "demo.page.title": "Remittance Demo",
    "demo.page.subtitle": "Test the complete flow of sending and receiving remittances",
    
    // Demo Tabs
    "demo.tabs.send": "Send Remittance",
    "demo.tabs.receive": "Receive Remittances",
    "demo.tabs.banking": "Banking Identity",
    
    // Demo Send Section
    "demo.send.description": "Send USDC to any address or family group",
    "demo.send.recipient.address": "Recipient address",
    "demo.send.recipient.name": "Recipient name",
    "demo.send.recipient.phone": "Recipient phone",
    "demo.send.purpose": "Remittance purpose",
    "demo.send.family.group": "Send to ENS family group",
    "demo.send.family.select": "Select family group",
    "demo.send.family.select.placeholder": "Select a family group",
    "demo.send.family.target": "Specific recipient (optional)",
    "demo.send.family.target.placeholder": "Send to entire group",
    "demo.send.family.target.all": "Entire group (anyone can withdraw)",
    "demo.send.family.info": "Sending to family group:",
    "demo.send.submit.family": "Send to Family Group",
    "demo.send.submitting": "Sending remittance...",
    "demo.send.submitting.family": "Sending to family group...",
    "demo.send.another": "Send another remittance",
    "demo.send.success.title": "Remittance Sent!",
    "demo.send.success.family": "Your remittance has been sent to the family group and is available for withdrawal",
    "demo.send.success.regular": "Your remittance has been sent to escrow and is being processed",
    "demo.send.transaction.hash": "Transaction Hash",
    "demo.send.transaction.summary": "Transaction Summary",
    "demo.send.ftso.price": "FTSO Price",
    "demo.send.amount.to.send": "Amount to send",
    "demo.send.gross.value": "Gross value (Flare FTSO)",
    "demo.send.network.fee": "Network fee",
    "demo.send.platform.fee": "RemesaChain fee",
    "demo.send.recipient.will.receive": "Recipient will receive",
    "demo.send.available.for.withdrawal": "Available for withdrawal",
    
    // Demo Receive Section
    "demo.receive.description": "Check pending remittances for your wallet address",
    "demo.receive.wallet.address": "Your wallet address:",
    "demo.receive.pending.title": "Pending remittances:",
    "demo.receive.pending.empty": "You have no pending remittances at this time",
    "demo.receive.configure": "Configure bank reception",
    "demo.receive.matched": "✓ Matched with P2P operator. Select your bank account for deposit.",
    "demo.receive.selected.account": "Selected account:",
    "demo.receive.confirm.deposit": "Confirm deposit and generate voucher",
    
    // Demo Banking Section
    "demo.banking.title": "Banking Identity",
    "demo.banking.description": "Configure your bank accounts to receive USD deposits",
    
    // Demo Info Messages
    "demo.info.rates": "💡 Prices updated every 30 seconds from Flare oracles (FTSO)",
    "demo.info.family.sending": "🏠 Sending to family group:",
    
    // Demo Family Flow Info
    "demo.family.flow.available": "• The remittance is available in the family group contract",
    "demo.family.flow.withdraw": "• Authorized members can withdraw funds",
    "demo.family.flow.expires": "• Funds expire in 7 days if not withdrawn",
    "demo.family.flow.p2p": "• The remittance will be matched with a P2P operator",
    "demo.family.flow.deposit": "• The operator will deposit USD in the recipient's account",
    "demo.family.flow.time": "• The complete process takes 5-15 minutes",
    
    // Demo Warning
    "demo.warning.title": "Demo Mode",
    "demo.warning.description": "This is a functional demo. No real blockchain transactions or money are processed. All operations are simulated for demonstration purposes.",
    
    // Voucher Modal
    "voucher.title": "✓ Deposit Confirmed",
    "voucher.download": "Download Voucher",
    "voucher.close": "Close",

    // Common
    "common.loading": "Loading...",
    "common.success": "Success",
    "common.error": "Error",
    "common.connect-wallet": "Connect Wallet",
    "common.wallet-connected": "Wallet Connected",
    "common.back": "Back",
    "common.back-home": "Back to Home",
    "common.cancel": "Cancel",

    // Operator Registration
    "operator.title": "P2P Operator Registration",
    "operator.subtitle": "Join our operator network and help Ecuadorian families",
    "operator.benefits.title": "P2P Operator Benefits",
    "operator.benefits.commissions": "Commission income",
    "operator.benefits.commissions-desc": "Earn up to 0.5% per processed transaction",
    "operator.benefits.social": "Social impact",
    "operator.benefits.social-desc": "Help Ecuadorian families with cheaper remittances",
    "operator.benefits.security": "Guaranteed security",
    "operator.benefits.security-desc": "Escrow system protects all transactions",

    "operator.form.personal": "Personal Information",
    "operator.form.banking": "Banking Information",
    "operator.form.operational": "Operational Information",
    "operator.form.wallet": "Wallet Information",
    "operator.form.terms": "Terms and Conditions",

    "operator.success.title": "Registration Successful!",
    "operator.success.subtitle": "Your P2P operator application has been submitted",
    "operator.success.message": "We have received your application and will review it within 24-48 hours.",

    // Family Groups
    "family.title": "ENS Family Groups",
    "family.subtitle": "Manage family groups with ENS identities for shared remittances",
    "family.create.title": "Create Family Group",
    "family.create.name": "Group name",
    "family.create.ens": "Your ENS name",
    "family.create.submit": "Create Group",
    "family.create.success": "Family group created successfully",

    "family.manage.title": "Manage Group",
    "family.manage.members": "Members",
    "family.manage.stats": "Statistics",
    "family.manage.transactions": "Transactions",
    "family.manage.add-member": "Add Member",

    "family.member.add.title": "Add Family Member",
    "family.member.add.ens": "Member's ENS name",
    "family.member.add.permissions": "Permissions",
    "family.member.add.can-withdraw": "Can withdraw funds",
    "family.member.add.can-receive": "Can receive remittances",
    "family.member.add.submit": "Add Member",

    "family.stats.total-deposited": "Total Deposited",
    "family.stats.total-withdrawn": "Total Withdrawn",
    "family.stats.pending-amount": "Pending Amount",
    "family.stats.active-remittances": "Active Remittances",

    "family.remittances.title": "Group Remittances",
    "family.remittances.empty": "No remittances in this group",
    "family.remittances.withdraw": "Withdraw",
    "family.remittances.targeted": "Targeted to",
    "family.remittances.expires": "Expires",

    "family.no-groups": "You have no family groups",
    "family.no-groups.desc": "Create your first family group to get started",

    "family.member.role.admin": "Administrator",
    "family.member.role.member": "Member",
    "family.member.remove": "Remove",
    "family.member.update": "Update Permissions",

    // Banking Identity
    "banking.title": "Banking Identity",
    "banking.subtitle": "Configure your bank accounts to receive USD deposits",
    "banking.accounts.title": "Your Bank Accounts",
    "banking.accounts.empty": "You have no registered bank accounts",
    "banking.add.title": "Add Bank Account",
    "banking.add.bank": "Bank",
    "banking.add.account": "Account Number",
    "banking.add.type": "Account Type",
    "banking.add.holder": "Account Holder",
    "banking.add.cedula": "Holder's ID",
    "banking.add.submit": "Add Account",
    "banking.add.cancel": "Cancel",
    "banking.verify": "Verify",
    "banking.verified": "Verified",
    "banking.primary": "Primary",
    "banking.remove": "Remove",
    "banking.edit": "Edit",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  useEffect(() => {
    const saved = localStorage.getItem("remesachain-language") as Language
    if (saved && (saved === "es" || saved === "en")) {
      setLanguage(saved)
    }
  }, [])

  // Update HTML lang attribute when language changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language
    }
  }, [language])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("remesachain-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
