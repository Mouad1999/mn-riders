"use client"

import Link from "next/link"
import { Mail, Instagram, Facebook, Phone } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

export default function Footer() {
  const { lang } = useLanguage()
  const t = translations[lang]

  return (
    <footer className="bg-[#2F2F2F] border-t border-[#3A3A3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              MN RIDERS
            </h3>

            <p className="text-[#B0B0B0] text-sm">
              {t.footerBrandDesc}
            </p>

            {/* Social icons */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.instagram.com/mn_riiders/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-opacity hover:opacity-80"
              >
                <Instagram size={20} className="text-[#E4405F]" />
              </a>

              <a
                href="https://www.facebook.com/share/1D9TM2vNuz/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition-opacity hover:opacity-80"
              >
                <Facebook size={20} className="text-[#1877F2]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              {t.footerQuickLinks}
            </h4>

            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#B0B0B0] hover:text-white transition text-sm">
                  {t.navHome}
                </Link>
              </li>
              <li>
                <Link href="/hoodies" className="text-[#B0B0B0] hover:text-white transition text-sm">
                  {t.navHoodies}
                </Link>
              </li>
              <li>
                <Link href="/cagoules" className="text-[#B0B0B0] hover:text-white transition text-sm">
                  {t.navCagoules}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#B0B0B0] hover:text-white transition text-sm">
                  {t.navContact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              {t.footerContact}
            </h4>

            <div className="space-y-3">

              <a
                href="https://wa.me/212774945823"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#B0B0B0] hover:text-white transition text-sm"
              >
                <Phone size={16} className="text-[#25D366]" />
                +212 7 74 94 58 23 ({t.footerPhoneLabel})
              </a>

              <Link
                href="/contact"
                className="flex items-center gap-2 text-[#B0B0B0] hover:text-white transition text-sm"
              >
                <Mail size={16} className="text-[#EA4335]" />
                mnriiders@gmail.com
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#3A3A3A] pt-8 text-center text-[#B0B0B0] text-sm">
          {t.footerCopyright}
        </div>
      </div>
    </footer>
  )
}
