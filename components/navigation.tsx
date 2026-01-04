"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import CartButton from "./cart-button"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"


function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { lang, toggleLang } = useLanguage()
  const t = translations[lang]

  return (
    <nav className="fixed top-0 w-full bg-[#4A4A4A] z-50 border-b border-[#4A4A4A] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <div className="relative h-10 w-36 flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={160}
                height={40}
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className="text-white hover:text-[#E63946] transition-colors font-medium">
              {t.navHome}
            </Link>

            <Link href="/hoodies" className="text-white hover:text-[#E63946] transition-colors font-medium">
              {t.navHoodies}
            </Link>

            <Link href="/cagoules" className="text-white hover:text-[#E63946] transition-colors font-medium">
              {t.navCagoules}
            </Link>

            <Link href="/contact" className="text-white hover:text-[#E63946] transition-colors font-medium">
              {t.navContact}
            </Link>

            <button
              onClick={toggleLang}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition"
              aria-label="Change language"
            >
              <Image
                src={lang === "en" ? "/flags/fr.png" : "/flags/us.png"}
                alt={lang === "en" ? "Français" : "English"}
                width={24}
                height={24}
                className="object-contain"
              />
            </button>
            <CartButton />
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 py-2 hover:opacity-80 transition"
            >
              <Image
                src={lang === "en" ? "/flags/fr.png" : "/flags/us.png"}
                alt="language"
                width={22}
                height={22}
              />
            </button>
            <CartButton />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-[#E63946] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-2 animate-slide-down border-t border-[#2C2C2C]">
            <Link
              href="/"
              className="block text-white hover:text-[#E63946] transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t.navHome}
            </Link>

            <Link
              href="/hoodies"
              className="block text-white hover:text-[#E63946] transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t.navHoodies}
            </Link>

            <Link
              href="/cagoules"
              className="block text-white hover:text-[#E63946] transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t.navCagoules}
            </Link>

            <Link
              href="/contact"
              className="block text-white hover:text-[#E63946] transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t.navContact}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export { Navigation }
export default Navigation