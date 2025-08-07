import { fetchProductBySlug } from "@/actions/products"
import ProductDetailClient from "@/components/ProductDetailClient"
import { notFound } from "next/navigation"

interface ProductDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const { product } = await fetchProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProductDetailClient product={product} />
      </div>
    </div>
  )
}
