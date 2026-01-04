"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

const slides = ["/slide1.png", "/slide2.png", "/slide3.png", "/slide4.png"]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const { lang } = useLanguage()
  const t = translations[lang]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* SLIDES */}
      {slides.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt="MN Riders collection"
            fill
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-4xl text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            {t.heroTitleLine1}
            <span className="block text-[#E63946] mt-2">
              {t.heroTitleLine2}
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/hoodies"
              className="px-10 py-4 rounded-xl bg-[#E63946] text-white font-semibold text-lg
                         shadow-lg shadow-red-500/40 hover:shadow-red-600/60
                         hover:scale-[1.03] transition-all duration-300"
            >
              {t.shopHoodies}
            </Link>

            <Link
              href="/cagoules"
              className="px-10 py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg
                         shadow-lg shadow-blue-500/40 hover:shadow-blue-600/60
                         hover:scale-[1.03] transition-all duration-300"
            >
              {t.shopCagoules}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
