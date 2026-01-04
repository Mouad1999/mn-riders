"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingBag, X } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCart()
  const { lang } = useLanguage()
  const t = translations[lang]

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    remark: "",
  })

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  async function handleSubmit() {
    if (!form.fullName || !form.email || !form.phone || !form.address) {
      alert(t.errorRequired)
      return
    }

    try {
      setLoading(true)

      const res = await fetch("/api/send-email/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          ...form,
        }),
      })

      if (!res.ok) throw new Error("Failed")

      alert(t.successOrder)
      setOpen(false)
    } catch {
      alert(t.errorOrder)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-12">
        <h1 className="text-3xl font-bold mb-8">{t.cartTitle}</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-6">{t.cartEmpty}</p>

            <Link href="/hoodies">
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold">
                {t.continueShopping}
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border p-4 rounded-lg flex gap-4"
                >
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-blue-600 font-semibold">
                      MAD{item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        −
                      </button>

                      <span className="px-3">{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-white border rounded-lg p-6 shadow sticky top-4">
              <h2 className="text-xl font-bold mb-4">
                {t.orderSummary}
              </h2>

              <div className="flex justify-between mb-4">
                <span>{t.total}</span>
                <span className="font-bold text-blue-600">
                  MAD{total.toFixed(2)}
                </span>
              </div>

              {/* 🔥 ATTRACTIVE CHECKOUT BUTTON */}
              <button
                onClick={() => setOpen(true)}
                className="
                  w-full py-4 rounded-xl font-bold text-white text-lg
                  bg-gradient-to-r from-[#1f1f1f] via-[#2a2a2a] to-[#4a4a4a]
                  shadow-lg shadow-black/40
                  hover:shadow-black/60
                  hover:-translate-y-[1px]
                  transition-all duration-300
                  animate-pulse
                  hover:animate-none
                "
              >
                {t.checkout}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative animate-scale-in">
            
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-black transition"
            >
              <X />
            </button>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-black">
              {t.checkoutTitle}
            </h2>

            {/* FORM */}
            <div className="space-y-4">

              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300
                          focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder={t.fullName}
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
              />

              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300
                          focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder={t.email}
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300
                          focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder={t.phone}
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300
                          focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder={t.address}
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />

              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-300 resize-none
                          focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder={t.remark}
                rows={3}
                value={form.remark}
                onChange={(e) =>
                  setForm({ ...form, remark: e.target.value })
                }
              />

              {/* SUBMIT */}
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="
                  w-full py-4 rounded-xl font-bold text-white text-lg
                  bg-gradient-to-r from-[#1f1f1f] via-[#2a2a2a] to-[#4a4a4a]
                  shadow-lg shadow-black/40
                  hover:shadow-black/60
                  hover:-translate-y-[1px]
                  transition-all duration-300
                  disabled:opacity-60
                "
              >
                {loading ? t.sending : t.submitOrder}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
