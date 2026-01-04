import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Hero from "@/components/hero"
import FeaturedProducts from "@/components/featured-products"

export const metadata = {
  title: "MN RIDERS",
  description: "PRINT YOUR ENGIN STORY",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <FeaturedProducts />
      <Footer />
    </main>
  )
}
