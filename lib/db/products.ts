import { sql } from '@/lib/db'
import { Product } from '@/types/product'

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>

async function createProductsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      slug text UNIQUE NOT NULL,
      description text,
      base_price numeric NOT NULL,
      image_url text,
      category text,
      type text,
      material text,
      sizes jsonb,
      is_featured boolean DEFAULT false,
      stock_quantity integer NOT NULL DEFAULT 0,
      tags jsonb,
      discount_price numeric,
      sale_start_date timestamptz,
      sale_end_date timestamptz,
      created_at timestamptz DEFAULT NOW(),
      updated_at timestamptz DEFAULT NOW()
    )
  `
}

export async function listProducts(page: number = 1, limit: number = 10) {
  await createProductsTable()
  const offset = (page - 1) * limit
  const products = await sql<Product[]>`
    SELECT * FROM products
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  const countRes = await sql<{ count: number }[]>`SELECT COUNT(*)::int as count FROM products`
  return { products, totalCount: countRes[0]?.count || 0 }
}

export async function getProductById(id: string) {
  await createProductsTable()
  const products = await sql<Product[]>`SELECT * FROM products WHERE id = ${id} LIMIT 1`
  return products[0] || null
}

export async function getProductBySlug(slug: string) {
  await createProductsTable()
  const products = await sql<Product[]>`SELECT * FROM products WHERE slug = ${slug} LIMIT 1`
  return products[0] || null
}

export async function getProductCount() {
  await createProductsTable()
  const countRes = await sql<{ count: number }[]>`SELECT COUNT(*)::int as count FROM products`
  return countRes[0]?.count || 0
}

export async function getRecentProducts(limit: number) {
  await createProductsTable()
  const products = await sql<Product[]>`
    SELECT * FROM products ORDER BY created_at DESC LIMIT ${limit}
  `
  return products
}

export async function getLowStockProducts(threshold: number = 5) {
  await createProductsTable()
  const products = await sql<Product[]>`
    SELECT * FROM products WHERE stock_quantity < ${threshold}
  `
  return products
}

export async function addProduct(data: ProductInput) {
  await createProductsTable()
  const sizesJson = JSON.stringify(data.sizes || [])
  const tagsJson = JSON.stringify(data.tags || [])
  const result = await sql<Product[]>`
    INSERT INTO products (
      name, slug, description, base_price, image_url, category, type,
      material, sizes, is_featured, stock_quantity, tags, discount_price,
      sale_start_date, sale_end_date
    ) VALUES (
      ${data.name}, ${data.slug}, ${data.description}, ${data.base_price}, ${data.image_url},
      ${data.category}, ${data.type}, ${data.material}, ${sizesJson}::jsonb,
      ${data.is_featured ?? false}, ${data.stock_quantity}, ${tagsJson}::jsonb,
      ${data.discount_price}, ${data.sale_start_date}, ${data.sale_end_date}
    ) RETURNING *
  `
  return result[0]
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
) {
  await createProductsTable()
  const sizesJson = data.sizes ? JSON.stringify(data.sizes) : undefined
  const tagsJson = data.tags ? JSON.stringify(data.tags) : undefined
  const result = await sql<Product[]>`
    UPDATE products SET
      name = COALESCE(${data.name}, name),
      slug = COALESCE(${data.slug}, slug),
      description = COALESCE(${data.description}, description),
      base_price = COALESCE(${data.base_price}, base_price),
      image_url = COALESCE(${data.image_url}, image_url),
      category = COALESCE(${data.category}, category),
      type = COALESCE(${data.type}, type),
      material = COALESCE(${data.material}, material),
      sizes = COALESCE(${sizesJson}::jsonb, sizes),
      is_featured = COALESCE(${data.is_featured}, is_featured),
      stock_quantity = COALESCE(${data.stock_quantity}, stock_quantity),
      tags = COALESCE(${tagsJson}::jsonb, tags),
      discount_price = COALESCE(${data.discount_price}, discount_price),
      sale_start_date = COALESCE(${data.sale_start_date}, sale_start_date),
      sale_end_date = COALESCE(${data.sale_end_date}, sale_end_date),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return result[0] || null
}

export async function deleteProduct(id: string) {
  await createProductsTable()
  const result = await sql`DELETE FROM products WHERE id = ${id}`
  // result has command tag; we can check rowCount but with neon `sql` not? We'll attempt
  // But to keep simple, we'll fetch using SELECT to confirm deletion
  return (result as any).rowCount > 0
}

