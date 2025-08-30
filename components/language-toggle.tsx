"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "./language-provider"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "es" ? "en" : "es")}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {language === "es" ? "EN" : "ES"}
    </Button>
  )
}
