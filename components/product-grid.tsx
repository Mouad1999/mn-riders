import ProductCard from "@/components/product-card"

interface ProductGridProps {
  products: Array<{
    id: number
    name: string
    price: number
    image: string
    description: string
  }>
  variant?: "red" | "blue"
}

export default function ProductGrid({
  products,
  variant = "red",
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
        />
      ))}
    </div>
  )
}
