export interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
}

/* ---------------- HOODIES ---------------- */

export const HOODIES: Product[] = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  name: `MN Riders Hoodie ${i + 1}`,
  price: 250 + (i % 3) * 10,
  image: `/hoodie${i + 1}.png`,
  description:
    "Premium hoodie designed for comfort, durability, and street performance.",
}))

/* ---------------- CAGOULES ---------------- */

export const CAGOULES: Product[] = Array.from({ length: 7 }, (_, i) => ({
  id: 100 + i,
  name: `MN Riders Cagoule ${i + 1}`,
  price: 100 + i * 10,
  image: `/mask${i + 1}.png`,
  description:
    "Weather-resistant cagoule built for protection, performance, and style.",
}))
