"use client"

import Image from "next/image"
import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { ShoppingCart, Check } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    image: string
    description: string
  }
  variant?: "red" | "blue"
}

export default function ProductCard({
  product,
  variant = "red",
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addToCart } = useCart()

  const { lang } = useLanguage()
  const t = translations[lang]

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1800)
  }

  const isBlue = variant === "blue"

  return (
    <div
      className="group flex flex-col h-full animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden rounded-xl mb-3 bg-gray-100 border border-gray-200 shadow-sm transition-all group-hover:shadow-xl">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
      </div>

      {/* TITLE */}
      <h3 className="text-sm md:text-[15px] font-semibold text-neutral-900 mb-1 line-clamp-2">
        {product.name}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-[11px] md:text-xs text-neutral-500 mb-2 line-clamp-2">
        {product.description}
      </p>

      {/* PRICE */}
      <p
        className={`text-base md:text-lg font-bold mb-3 ${
          isBlue ? "text-blue-600" : "text-red-600"
        }`}
      >
        {t.currency}
        {product.price.toFixed(2)}
      </p>

      {/* BUTTON */}
      <button
        onClick={handleAddToCart}
        className={`relative w-full py-2.5 md:py-3 rounded-xl font-semibold
          ${
            lang === "fr"
              ? "text-[11px] md:text-[12px] tracking-tight"
              : "text-[13px] md:text-sm tracking-wide"
          }
          flex items-center justify-center gap-2
          transition-all duration-300
          ${
            isAdded
              ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
              : variant === "blue"
              ? `
                bg-gradient-to-r from-[#1f1f1f] via-[#2a2a2a] to-blue-500
                text-white
                shadow-lg shadow-blue-500/40
                hover:shadow-blue-600/60
                hover:-translate-y-[1px]
              `
              : `
                bg-gradient-to-r from-[#1f1f1f] via-[#2a2a2a] to-[#E63946]
                text-white
                shadow-lg shadow-black/40
                hover:shadow-red-500/40
                hover:-translate-y-[1px]
              `
          }
        `}
      >
        {isAdded ? (
          <>
            <Check size={16} />
            {t.added}
          </>
        ) : (
          <>
            {t.addToCart}
            <ShoppingCart className="transition-transform group-hover:scale-110" size={16} />
          </>
        )}
      </button>
    </div>
  )
}
