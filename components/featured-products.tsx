"use client"

import { HOODIES, CAGOULES } from "@/lib/products"
import ProductCard from "@/components/product-card"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

export default function FeaturedProducts() {
  const { lang } = useLanguage()
  const t = translations[lang]

  const featuredHoodies = HOODIES.slice(0, 4)
  const featuredCagoules = CAGOULES.slice(0, 4)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">

      {/* HOODIES */}
      <div className="mb-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-2xl md:text-5xl font-bold mb-2">
              <span className="text-black">{t.featured}</span>{" "}
              <span className="text-red-600">{t.hoodiesTitle}</span>
            </h2>
            <p className="text-xs md:text-base text-gray-600">
              {t.hoodiesSubtitle}
            </p>
          </div>

          <Link
            href="/hoodies"
            className="text-red-600 hover:text-red-700 font-bold underline text-xs md:text-base transition-colors"
          >
            {t.viewAll}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredHoodies.map((product) => (
            <ProductCard key={product.id} product={product} variant="red" />
          ))}
        </div>
      </div>

      {/* CAGOULES / BALACLAVAS */}
      <div>
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-2xl md:text-5xl font-bold mb-2">
              <span className="text-blue-600">{t.cagoulesTitle}</span>
            </h2>

            <div className="max-w-[209px]">
              <p className="text-xs md:text-base text-gray-600">
                {t.cagoulesSubtitle}
              </p>
            </div>
          </div>

          <Link
            href="/cagoules"
            className="text-blue-600 hover:text-blue-700 font-bold underline text-xs md:text-base transition-colors"
          >
            {t.viewAll}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredCagoules.map((product) => (
            <ProductCard key={product.id} product={product} variant="blue" />
          ))}
        </div>
      </div>
    </section>
  )
}
