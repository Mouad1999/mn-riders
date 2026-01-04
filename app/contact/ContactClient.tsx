"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ContactForm from "@/components/contact-form"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

export default function ContactClient() {
  const { lang } = useLanguage()
  const t = translations[lang]

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </div>

      <Footer />
    </main>
  )
}
