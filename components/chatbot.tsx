"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle, X } from "lucide-react"
import { HOODIES, CAGOULES } from "@/lib/products"
import { useCart } from "@/context/cart-context"
import { useLanguage } from "@/context/language-context"
import { translations } from "@/lib/translations"

type Product = {
  id: number
  name: string
  price: number
  image: string
}

type Message =
  | { from: "user" | "bot"; text: string }
  | { from: "bot"; products: Product[] }

type LastList = "hoodies" | "cagoules" | null

function extractNumbers(text: string): number[] {
  return text.match(/\d+(\.\d+)?/g)?.map((n) => Number(n)) ?? []
}

function parsePriceRange(q: string): { min?: number; max?: number } | null {
  const nums = extractNumbers(q)
  if (nums.length === 0) return null

  const hasBetween =
    q.includes("between") ||
    q.includes("from") ||
    q.includes("to") ||
    q.includes("entre") ||
    q.includes("de ") ||
    q.includes("à ") ||
    q.includes("et ")

  // between X and Y
  if (hasBetween && nums.length >= 2) {
    const min = Math.min(nums[0], nums[1])
    const max = Math.max(nums[0], nums[1])
    return { min, max }
  }

  // under / less than / <= X
  if (
    q.includes("under") ||
    q.includes("less than") ||
    q.includes("moins de") ||
    q.includes("<=") ||
    q.includes("<")
  ) {
    return { max: nums[0] }
  }

  // over / more than / >= X
  if (
    q.includes("over") ||
    q.includes("more than") ||
    q.includes("plus de") ||
    q.includes(">=") ||
    q.includes(">")
  ) {
    return { min: nums[0] }
  }

  // If user wrote just one number, interpret as "around" (±20) to be helpful
  if (nums.length === 1) {
    const n = nums[0]
    return { min: Math.max(0, n - 20), max: n + 20 }
  }

  return null
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "👋 Hi! I’m your MN RIDERS assistant.\nAsk me about hoodies, balaclavas, delivery, contact, or prices (ex: between 250 and 270).",
    },
  ])

  // ✅ Remember what user last listed, and the exact products shown
  const [lastList, setLastList] = useState<LastList>(null)
  const [lastShown, setLastShown] = useState<Product[]>([])

  const { addToCart } = useCart()
  const { lang } = useLanguage()
  const t = translations[lang]

  const allHoodies: Product[] = useMemo(
    () => HOODIES.map((p) => ({ id: p.id, name: p.name, price: p.price, image: p.image })),
    []
  )
  const allCagoules: Product[] = useMemo(
    () => CAGOULES.map((p) => ({ id: p.id, name: p.name, price: p.price, image: p.image })),
    []
  )

  function setList(kind: "hoodies" | "cagoules", products: Product[]) {
    setLastList(kind)
    setLastShown(products)

    // add numbering ONLY for display (not stored)
    return {
      products: products.map((p, i) => ({
        ...p,
        name: `${i + 1}. ${p.name}`,
      })),
    }
  }

  function handleAddByNumbers(nums: number[], forcedKind?: "hoodies" | "cagoules") {
    // if user says "add cagoules 2" → forcedKind is used
    // else use last shown list (the correct behavior)
    const sourceKind = forcedKind ?? lastList

    // If no last list, fallback to hoodies (but better to guide)
    if (!sourceKind || lastShown.length === 0) {
      return {
        text:
          lang === "fr"
            ? "D’abord, affiche une liste (hoodies ou cagoules), puis dis : “ajoute 1 et 3”."
            : "First, show a list (hoodies or balaclavas), then say: “add 1 and 3”.",
      }
    }

    // ✅ Most important: add from lastShown, not from HOODIES/CAGOULES indexes globally
    const added: string[] = []

    nums.forEach((n) => {
      const p = lastShown[n - 1]
      if (!p) return

      addToCart({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
      })
      added.push(p.name)
    })

    if (added.length === 0) {
      return {
        text:
          lang === "fr"
            ? "Je n’ai pas trouvé ces numéros dans la liste affichée."
            : "I couldn’t find those numbers in the displayed list.",
      }
    }

    return {
      text:
        lang === "fr"
          ? `✅ Ajouté au panier :\n• ${added.join("\n• ")}`
          : `✅ Added to cart:\n• ${added.join("\n• ")}`,
    }
  }

  function reply(text: string) {
    const q = text.toLowerCase()
    const nums = extractNumbers(q)

    const isAdd =
      q.includes("add") ||
      q.includes("ajoute") ||
      q.includes("ajouter") ||
      q.includes("panier") ||
      q.includes("cart")

    const mentionsHoodies =
      q.includes("hoodie") || q.includes("hoodies")
    const mentionsCagoules =
      q.includes("cagoule") || q.includes("cagoules") || q.includes("balaclava") || q.includes("balaclavas")

    // ✅ CONTACT
    if (q.includes("contact") || q.includes("instagram") || q.includes("facebook")) {
      return {
        text:
          lang === "fr"
            ? "📞 WhatsApp: 0636743640\n📧 Email: mnriiders@gmail.com\n📸 Instagram: (clique)\n📘 Facebook: (clique)"
            : "📞 WhatsApp: 0636743640\n📧 Email: mnriiders@gmail.com\n📸 Instagram: (click)\n📘 Facebook: (click)",
      }
    }

    // ✅ DELIVERY
    if (q.includes("delivery") || q.includes("livraison")) {
      return {
        text:
          lang === "fr"
            ? "📦 Livraison partout au Maroc.\n💰 Paiement à la livraison."
            : "📦 Delivery everywhere in Morocco.\n💰 Cash on delivery.",
      }
    }

    // ✅ ADD BY NUMBERS (must happen early)
    if (isAdd && nums.length > 0) {
      // if user explicitly mentioned category, lock it
      const forcedKind =
        mentionsCagoules ? "cagoules" : mentionsHoodies ? "hoodies" : undefined

      return handleAddByNumbers(nums.map(n => Math.floor(n)), forcedKind)
    }

    // ✅ PRICE FILTERING
    const range = parsePriceRange(q)
    if (range && (mentionsHoodies || mentionsCagoules)) {
      const base = mentionsCagoules ? allCagoules : allHoodies
      const filtered = base.filter((p) => {
        const okMin = range.min == null ? true : p.price >= range.min
        const okMax = range.max == null ? true : p.price <= range.max
        return okMin && okMax
      })

      if (filtered.length === 0) {
        return {
          text:
            lang === "fr"
              ? "Aucun produit trouvé dans cette fourchette de prix."
              : "No products found in that price range.",
        }
      }

      return setList(mentionsCagoules ? "cagoules" : "hoodies", filtered)
    }

    // ✅ LIST HOODIES
    if (mentionsHoodies) {
      return setList("hoodies", allHoodies)
    }

    // ✅ LIST CAGOULES / BALACLAVAS
    if (mentionsCagoules) {
      return setList("cagoules", allCagoules)
    }

    return {
      text:
        lang === "fr"
          ? "Je peux :\n• afficher des hoodies ou cagoules\n• filtrer par prix (ex: hoodies entre 250 et 270)\n• ajouter au panier (ex: ajoute 1 et 3)\n• donner livraison / contact"
          : "I can:\n• show hoodies or balaclavas\n• filter by price (ex: hoodies between 250 and 270)\n• add to cart (ex: add 1 and 3)\n• share delivery / contact info",
    }
  }

  function handleSend() {
    if (!input.trim()) return

    const userInput = input
    setMessages((m) => [...m, { from: "user", text: userInput }])
    setInput("")

    setTimeout(() => {
      const response = reply(userInput)
      setMessages((m) => [...m, { from: "bot", ...response }])
    }, 350)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
      >
        <MessageCircle />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] h-[520px] bg-white rounded-2xl shadow-2xl border flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-bold">MN RIDERS Assistant</h3>
            <button onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.map((msg, i) =>
              "products" in msg ? (
                <div key={i} className="space-y-3">
                  {msg.products.map((p) => (
                    <div key={p.id} className="flex gap-3 border rounded-lg p-2">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={48}
                        height={48}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-red-600 font-bold">MAD {p.price}</p>

                        <button
                          onClick={() =>
                            addToCart({
                              id: p.id,
                              name: p.name.replace(/^\d+\.\s*/, ""),
                              price: p.price,
                              image: p.image,
                            })
                          }
                          className="mt-1 text-xs bg-black text-white px-2 py-1 rounded"
                        >
                          {lang === "fr" ? "Ajouter au panier" : "Add to cart"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  key={i}
                  className={`max-w-[80%] p-2 rounded-lg whitespace-pre-line ${
                    msg.from === "bot" ? "bg-gray-100" : "bg-black text-white ml-auto"
                  }`}
                >
                  {/* Make social links clickable */}
                  {msg.text.includes("https://") ? (
                    <div className="space-y-2">
                      {msg.text.split("\n").map((line, idx) => {
                        const urlMatch = line.match(/https:\/\/\S+/)
                        if (urlMatch) {
                          const url = urlMatch[0]
                          const label = line.replace(url, "").trim()
                          return (
                            <div key={idx}>
                              <span>{label} </span>
                              <Link
                                href={url}
                                target="_blank"
                                className="text-blue-600 underline"
                              >
                                {url}
                              </Link>
                            </div>
                          )
                        }
                        return <div key={idx}>{line}</div>
                      })}
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              )
            )}
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={lang === "fr" ? "Écrivez votre message..." : "Type your message..."}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button onClick={handleSend} className="bg-black text-white px-3 rounded-lg">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
