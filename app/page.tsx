"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Clock, DollarSign, Shield, Users, Zap, ChevronRight, Send, Globe, Banknote } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { LanguageToggle } from "@/components/language-toggle"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { RealTimeRates } from "@/components/real-time-rates"
import Link from "next/link"

export default function RemesaChainLanding() {
  const { t } = useLanguage()
  const [operatorForm, setOperatorForm] = useState({
    nombre: "",
    banco: "",
    volumen: "",
    contacto: "",
  })

  const [sponsorForm, setSponsorForm] = useState({
    organizacion: "",
    contacto: "",
    mensaje: "",
  })

  const handleOperatorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Operador P2P:", operatorForm)
    // Aquí iría la lógica de envío
  }

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Sponsor:", sponsorForm)
    // Aquí iría la lógica de envío
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RC</span>
            </div>
            <span className="font-bold text-xl text-foreground">RemesaChain</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#inicio" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.home")}
            </a>
            <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.how-it-works")}
            </a>
            <a href="#sponsors" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.sponsors")}
            </a>
            <a href="#contacto" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.contact")}
            </a>
            <Link href="/family-groups" className="text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.family-groups")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <WalletConnectButton variant="outline" size="sm" />
            <Link href="/demo">
              <Button className="bg-accent hover:bg-accent/90">{t("nav.demo")}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              {t("hero.title").split("rápidas y económicas")[0]}
              <span className="text-primary">rápidas y económicas</span>
              {t("hero.title").split("rápidas y económicas")[1]}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">{t("hero.subtitle")}</p>

            <div className="max-w-md mx-auto mb-8">
              <RealTimeRates />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/demo">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  {t("hero.demo-btn")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/operator">
                <Button size="lg" variant="outline">
                  {t("hero.operator-btn")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/family-groups">
                <Button size="lg" variant="secondary">
                  <Users className="mr-2 h-4 w-4" />
                  {t("nav.family-groups")}
                </Button>
              </Link>
            </div>

            {/* Visual Flow */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-2">
                    <Send className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <span className="text-sm font-medium">USDC (remitente)</span>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
                    <Shield className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">Escrow</span>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-2">
                    <Users className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-medium">P2P</span>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-2">
                    <Banknote className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <span className="text-sm font-medium">USD en banco</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problema Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t("problems.title")}</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <DollarSign className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <CardTitle className="text-destructive">{t("problems.high-fees")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t("problems.high-fees-desc")}</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Clock className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <CardTitle className="text-destructive">{t("problems.slow")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t("problems.slow-desc")}</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Globe className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <CardTitle className="text-destructive">{t("problems.exclusion")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t("problems.exclusion-desc")}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solución Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t("solution.title")}</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center border-primary/20">
                <CardHeader>
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-primary">{t("solution.instant-transfers")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t("solution.instant-transfers-desc")}</p>
                </CardContent>
              </Card>

              <Card className="text-center border-primary/20">
                <CardHeader>
                  <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-primary">{t("solution.fixed-fees")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t("solution.fixed-fees-desc")}</p>
                </CardContent>
              </Card>

              <Card className="text-center border-primary/20">
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-primary">{t("solution.local-p2p-network")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t("solution.local-p2p-network-desc")}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t("sponsors.title")}</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">B</span>
                    </div>
                    <CardTitle className="text-lg">{t("sponsors.base")}</CardTitle>
                    <CardDescription className="text-sm">{t("sponsors.base-desc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{t("sponsors.base-info")}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <CardTitle className="text-lg">{t("sponsors.ens")}</CardTitle>
                    <CardDescription className="text-sm">{t("sponsors.ens-desc")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{t("sponsors.ens-info")}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">F</span>
                    </div>
                    <CardTitle className="text-lg">{t("sponsors.filecoin")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{t("sponsors.filecoin-info")}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-red-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">FL</span>
                    </div>
                    <CardTitle className="text-lg">{t("sponsors.flare")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{t("sponsors.flare-info")}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-indigo-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <CardTitle className="text-lg">{t("sponsors.lisk")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{t("sponsors.lisk-info")}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cómo funciona Section */}
      <section id="como-funciona" className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t("how-it-works.title")}</h2>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary-foreground font-bold text-2xl">1</span>
                    </div>
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-border"></div>
                  </div>
                  <h3 className="font-semibold mb-2">{t("how-it-works.step1-title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("how-it-works.step1-desc")}</p>
                </div>

                <div className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-accent-foreground font-bold text-2xl">2</span>
                    </div>
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-border"></div>
                  </div>
                  <h3 className="font-semibold mb-2">{t("how-it-works.step2-title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("how-it-works.step2-desc")}</p>
                </div>

                <div className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-secondary-foreground font-bold text-2xl">3</span>
                    </div>
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-border"></div>
                  </div>
                  <h3 className="font-semibold mb-2">{t("how-it-works.step3-title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("how-it-works.step3-desc")}</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold text-2xl">4</span>
                  </div>
                  <h3 className="font-semibold mb-2">{t("how-it-works.step4-title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("how-it-works.step4-desc")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contacto" className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t("cta.title")}</h2>

            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Operador P2P Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">{t("cta.operator-title")}</CardTitle>
                  <CardDescription>{t("cta.operator-desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleOperatorSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="nombre">{t("cta.operator-name")}</Label>
                      <Input
                        id="nombre"
                        value={operatorForm.nombre}
                        onChange={(e) => setOperatorForm({ ...operatorForm, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="banco">{t("cta.operator-bank")}</Label>
                      <Input
                        id="banco"
                        value={operatorForm.banco}
                        onChange={(e) => setOperatorForm({ ...operatorForm, banco: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="volumen">{t("cta.operator-volume")}</Label>
                      <Input
                        id="volumen"
                        value={operatorForm.volumen}
                        onChange={(e) => setOperatorForm({ ...operatorForm, volumen: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contacto-op">{t("cta.operator-contact")}</Label>
                      <Input
                        id="contacto-op"
                        value={operatorForm.contacto}
                        onChange={(e) => setOperatorForm({ ...operatorForm, contacto: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      {t("cta.operator-submit")}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Sponsor Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-accent">{t("cta.sponsor-title")}</CardTitle>
                  <CardDescription>{t("cta.sponsor-desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSponsorSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="organizacion">{t("cta.sponsor-organization")}</Label>
                      <Input
                        id="organizacion"
                        value={sponsorForm.organizacion}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, organizacion: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contacto-sponsor">{t("cta.sponsor-contact")}</Label>
                      <Input
                        id="contacto-sponsor"
                        value={sponsorForm.contacto}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, contacto: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="mensaje">{t("cta.sponsor-message")}</Label>
                      <Textarea
                        id="mensaje"
                        value={sponsorForm.mensaje}
                        onChange={(e) => setSponsorForm({ ...sponsorForm, mensaje: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                      {t("cta.sponsor-submit")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">RC</span>
              </div>
              <span className="font-bold text-xl text-foreground">RemesaChain</span>
            </div>

            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.terms")}
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.privacy")}
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.github")}
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">{t("footer.disclaimer")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
