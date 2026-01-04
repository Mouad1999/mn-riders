"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Language = "en" | "fr"

interface LanguageContextType {
  lang: Language
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null
    if (saved) setLang(saved)
  }, [])

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === "en" ? "fr" : "en"
      localStorage.setItem("lang", next)
      return next
    })
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider")
  return ctx
}
