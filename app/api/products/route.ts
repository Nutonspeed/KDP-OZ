import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import * as productService from '@/lib/services/products'

const productSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  base_price: z.number(),
  image_url: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  material: z.string().optional(),
  sizes: z.array(z.string()),
  is_featured: z.boolean().optional(),
  stock_quantity: z.number(),
  tags: z.array(z.string()).optional(),
  discount_price: z.number().optional(),
  sale_start_date: z.string().optional(),
  sale_end_date: z.string().optional()
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const data = productService.listProducts(page, limit)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const parsed = productSchema.parse(json)
    const product = productService.addProduct(parsed)
    return NextResponse.json({ success: true, product })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 })
    }
    console.error('Product creation error', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
