import { NextResponse } from 'next/server'
import { z } from 'zod'
import { fetchProductById, updateProduct, deleteProduct } from '@/actions/products'

const updateSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  base_price: z.number().optional(),
  image_url: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  material: z.string().optional(),
  sizes: z.array(z.string()).optional(),
  is_featured: z.boolean().optional(),
  stock_quantity: z.number().optional(),
  tags: z.array(z.string()).optional(),
  discount_price: z.number().optional(),
  sale_start_date: z.string().optional(),
  sale_end_date: z.string().optional(),
})

export async function GET(_req: Request, { params }: any) {
  const { id } = params as { id: string }
  const { product } = await fetchProductById(id)
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ product })
}

export async function PUT(req: Request, { params }: any) {
  const { id } = params as { id: string }
  try {
    const json = await req.json()
    const parsed = updateSchema.parse(json)
    const result = await updateProduct(id, parsed)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 })
    }
    console.error('Product update error', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: any) {
  const { id } = params as { id: string }
  const result = await deleteProduct(id)
  return NextResponse.json(result, { status: result.success ? 200 : 404 })
}
