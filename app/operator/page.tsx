"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Users, DollarSign, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { WalletGuard } from "@/components/wallet-guard"
import { useWallet } from "@/components/wallet-provider"
import Link from "next/link"

interface OperatorFormData {
  fullName: string
  email: string
  phone: string
  primaryBank: string
  secondaryBank: string
  monthlyVolume: string
  experience: string
  whatsapp: string
  city: string
  province: string
  acceptTerms: boolean
  acceptKyc: boolean
}

export default function OperatorRegistration() {
  const { t } = useLanguage()
  const { address } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<OperatorFormData>({
    fullName: "",
    email: "",
    phone: "",
    primaryBank: "",
    secondaryBank: "",
    monthlyVolume: "",
    experience: "",
    whatsapp: "",
    city: "",
    province: "",
    acceptTerms: false,
    acceptKyc: false,
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

  const ecuadorianProvinces = [
    "Azuay",
    "Bolívar",
    "Cañar",
    "Carchi",
    "Chimborazo",
    "Cotopaxi",
    "El Oro",
    "Esmeraldas",
    "Galápagos",
    "Guayas",
    "Imbabura",
    "Loja",
    "Los Ríos",
    "Manabí",
    "Morona Santiago",
    "Napo",
    "Orellana",
    "Pastaza",
    "Pichincha",
    "Santa Elena",
    "Santo Domingo de los Tsáchilas",
    "Sucumbíos",
    "Tungurahua",
    "Zamora Chinchipe",
  ]

  const handleInputChange = (field: keyof OperatorFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.acceptTerms || !formData.acceptKyc) {
      alert("Debes aceptar los términos y condiciones y el proceso KYC")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("[v0] Operator registration data:", {
        ...formData,
        walletAddress: address,
        timestamp: new Date().toISOString(),
      })

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting operator registration:", error)
      alert("Error al enviar el registro. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-primary">¡Registro Exitoso!</CardTitle>
                  <CardDescription className="text-lg">
                    Tu solicitud para ser operador P2P ha sido enviada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Hemos recibido tu solicitud y la revisaremos en las próximas 24-48 horas. Te contactaremos al
                    WhatsApp proporcionado para continuar con el proceso de verificación.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2">Próximos pasos:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 text-left">
                      <li>• Verificación de identidad (KYC)</li>
                      <li>• Validación de cuentas bancarias</li>
                      <li>• Configuración de límites operativos</li>
                      <li>• Capacitación en la plataforma</li>
                    </ul>
                  </div>
                  <Link href="/">
                    <Button className="w-full">Volver al inicio</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Registro de Operador P2P</h1>
              <p className="text-muted-foreground">
                Únete a nuestra red de operadores y ayuda a las familias ecuatorianas
              </p>
            </div>
          </div>

          <WalletGuard
            title="Conecta tu wallet para continuar"
            description="Necesitas conectar tu wallet para registrarte como operador P2P"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Benefits Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-primary">Beneficios del Operador P2P</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Ingresos por comisiones</h4>
                        <p className="text-sm text-muted-foreground">Gana hasta 0.5% por cada transacción procesada</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Impacto social</h4>
                        <p className="text-sm text-muted-foreground">
                          Ayuda a familias ecuatorianas con remesas más baratas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Seguridad garantizada</h4>
                        <p className="text-sm text-muted-foreground">
                          Sistema de escrow protege todas las transacciones
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Registration Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Operador</CardTitle>
                    <CardDescription>Completa todos los campos para procesar tu solicitud</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Información Personal</h3>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fullName">Nombre completo *</Label>
                            <Input
                              id="fullName"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange("fullName", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Correo electrónico *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone">Teléfono *</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              placeholder="0999123456"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="whatsapp">WhatsApp *</Label>
                            <Input
                              id="whatsapp"
                              value={formData.whatsapp}
                              onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                              placeholder="0999123456"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">Ciudad *</Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) => handleInputChange("city", e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="province">Provincia *</Label>
                            <Select onValueChange={(value) => handleInputChange("province", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una provincia" />
                              </SelectTrigger>
                              <SelectContent>
                                {ecuadorianProvinces.map((province) => (
                                  <SelectItem key={province} value={province}>
                                    {province}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Banking Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Información Bancaria</h3>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="primaryBank">Banco principal *</Label>
                            <Select onValueChange={(value) => handleInputChange("primaryBank", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona tu banco principal" />
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
                            <Label htmlFor="secondaryBank">Banco secundario (opcional)</Label>
                            <Select onValueChange={(value) => handleInputChange("secondaryBank", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un banco secundario" />
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
                        </div>
                      </div>

                      {/* Operational Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Información Operativa</h3>

                        <div>
                          <Label htmlFor="monthlyVolume">Volumen mensual estimado (USD) *</Label>
                          <Select onValueChange={(value) => handleInputChange("monthlyVolume", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu volumen mensual" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                              <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                              <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                              <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                              <SelectItem value="50000+">$50,000+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="experience">Experiencia en remesas o cambio de divisas</Label>
                          <Textarea
                            id="experience"
                            value={formData.experience}
                            onChange={(e) => handleInputChange("experience", e.target.value)}
                            placeholder="Describe tu experiencia previa (opcional)"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Wallet Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Información de Wallet</h3>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm font-medium mb-2">Wallet conectada:</p>
                          <p className="text-sm text-muted-foreground font-mono">{address}</p>
                        </div>
                      </div>

                      {/* Terms and Conditions */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Términos y Condiciones</h3>

                        <div className="space-y-3">
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="acceptTerms"
                              checked={formData.acceptTerms}
                              onCheckedChange={(checked) => handleInputChange("acceptTerms", !!checked)}
                            />
                            <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
                              Acepto los términos y condiciones de RemesaChain y entiendo que seré responsable de
                              procesar las remesas de manera segura y oportuna.
                            </Label>
                          </div>

                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="acceptKyc"
                              checked={formData.acceptKyc}
                              onCheckedChange={(checked) => handleInputChange("acceptKyc", !!checked)}
                            />
                            <Label htmlFor="acceptKyc" className="text-sm leading-relaxed">
                              Acepto someterme al proceso de verificación de identidad (KYC) y proporcionar la
                              documentación requerida para operar como operador P2P.
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Warning */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">Importante</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              Este es un proyecto MVP para hackathon. No procesamos transacciones reales de dinero. La
                              funcionalidad es solo para demostración.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || !formData.acceptTerms || !formData.acceptKyc}
                      >
                        {isSubmitting ? "Enviando solicitud..." : "Enviar solicitud de registro"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </WalletGuard>
        </div>
      </div>
    </div>
  )
}
