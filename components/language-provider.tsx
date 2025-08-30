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

    // Common
    "common.loading": "Cargando...",
    "common.success": "Éxito",
    "common.error": "Error",
    "common.connect-wallet": "Conectar Wallet",
    "common.wallet-connected": "Wallet Conectada",

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

    // Common
    "common.loading": "Loading...",
    "common.success": "Success",
    "common.error": "Error",
    "common.connect-wallet": "Connect Wallet",
    "common.wallet-connected": "Wallet Connected",

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
