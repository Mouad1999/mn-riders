"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ProductGrid from "@/components/product-grid"
import { HOODIES } from "@/lib/products"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

export default function HoodiesClient() {
  const { lang } = useLanguage()
  const t = translations[lang]

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold tracking-tight mb-4">
              <span className="text-red-600">{t.hoodiesTitle}</span>
            </h1>

            <p className="text-lg text-muted-foreground">
              {t.hoodiesSubtitle}
            </p>
          </div>

          <ProductGrid products={HOODIES} />
        </div>
      </div>

      <Footer />
    </main>
  )
}
