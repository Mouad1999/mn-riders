import { HOODIES, CAGOULES } from "@/lib/products"

type Category = "hoodies" | "balaclavas"

/* ---------------- PRICE ---------------- */

export function parsePriceRange(message: string) {
  const numbers = message.match(/\d+/g)
  if (!numbers || numbers.length < 2) return null

  return {
    min: Number(numbers[0]),
    max: Number(numbers[1]),
  }
}

export function detectCategory(message: string): Category | null {
  const m = message.toLowerCase()

  if (m.includes("hoodie") || m.includes("hoodies") || m.includes("sweat")) {
    return "hoodies"
  }

  if (
    m.includes("balaclava") ||
    m.includes("balaclavas") ||
    m.includes("cagoule") ||
    m.includes("cagoules")
  ) {
    return "balaclavas"
  }

  return null
}

export function getProductsByCategoryAndPrice(
  category: Category,
  min: number,
  max: number
) {
  const source = category === "hoodies" ? HOODIES : CAGOULES

  return source.filter(
    (p) => p.price >= min && p.price <= max
  )
}

/* ---------------- BUSINESS FAQ ---------------- */

export function detectFAQ(message: string) {
  const m = message.toLowerCase()

  if (m.includes("deliver") || m.includes("livraison")) return "delivery"
  if (m.includes("contact") || m.includes("whatsapp") || m.includes("phone"))
    return "contact"
  if (
    m.includes("instagram") ||
    m.includes("facebook") ||
    m.includes("social")
  )
    return "social"
  if (
    m.includes("color") ||
    m.includes("colour") ||
    m.includes("couleur")
  )
    return "colors"

  return null
}
