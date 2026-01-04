"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import Link from "next/link"

export default function CartButton() {
  const { cartCount } = useCart()

  return (
    <Link href="/cart">
      <button className="relative p-2 hover:text-accent transition-colors">
        <ShoppingCart size={20} className="hidden md:block" />
        <ShoppingCart size={24} className="md:hidden" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
            {cartCount}
          </span>
        )}
      </button>
    </Link>
  )
}
