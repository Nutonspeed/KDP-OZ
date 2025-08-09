import { sql } from '@/lib/db'
import { Order, OrderItem } from '@/types/order'

export type OrderInput = Omit<Order, 'id' | 'created_at' | 'order_items'> & {
  order_items?: Omit<OrderItem, 'id' | 'order_id'>[]
}

async function createOrdersTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id text NOT NULL,
      total_amount numeric NOT NULL,
      status text NOT NULL,
      payment_status text NOT NULL,
      created_at timestamptz DEFAULT NOW(),
      notes text,
      shipping_address jsonb,
      invoice_url text,
      invoice_id text
    )
  `
  await sql`
    CREATE TABLE IF NOT EXISTS order_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
      product_id text NOT NULL,
      quantity integer NOT NULL,
      price numeric NOT NULL,
      product_name text,
      price_at_purchase numeric
    )
  `
}

export async function listOrders(page = 1, limit = 10): Promise<{ orders: Order[]; totalCount: number }> {
  await createOrdersTables()
  const offset = (page - 1) * limit
  const orders = (await sql`
    SELECT o.*, COALESCE(json_agg(oi.*) FILTER (WHERE oi.id IS NOT NULL), '[]') AS order_items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `) as any as Order[]
  const countRes = (await sql`SELECT COUNT(*)::int as count FROM orders`) as { count: number }[]
  return { orders, totalCount: countRes[0]?.count || 0 }
}

export async function getOrderById(id: string): Promise<Order | null> {
  await createOrdersTables()
  const orders = (await sql`
    SELECT o.*, COALESCE(json_agg(oi.*) FILTER (WHERE oi.id IS NOT NULL), '[]') AS order_items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.id = ${id}
    GROUP BY o.id
    LIMIT 1
  `) as any as Order[]
  return orders[0] || null
}

export async function createOrder(data: OrderInput): Promise<Order> {
  await createOrdersTables()
  const shippingJson = data.shipping_address ? JSON.stringify(data.shipping_address) : null
  const result = (await sql`
    INSERT INTO orders (user_id, total_amount, status, payment_status, notes, shipping_address, invoice_url, invoice_id)
    VALUES (
      ${data.user_id},
      ${data.total_amount},
      ${data.status},
      ${data.payment_status},
      ${data.notes},
      ${shippingJson}::jsonb,
      ${data.invoice_url},
      ${data.invoice_id}
    )
    RETURNING *
  `) as Order[]
  const order = result[0]
  if (data.order_items && data.order_items.length > 0) {
    for (const item of data.order_items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price, product_name, price_at_purchase)
        VALUES (${order.id}, ${item.product_id}, ${item.quantity}, ${item.price}, ${item.product_name}, ${item.price_at_purchase})
      `
    }
  }
  return (await getOrderById(order.id)) as Order
}

export async function updateOrder(id: string, data: Partial<Order>): Promise<Order | null> {
  await createOrdersTables()
  const shippingJson = data.shipping_address ? JSON.stringify(data.shipping_address) : undefined
  const result = (await sql`
    UPDATE orders SET
      user_id = COALESCE(${data.user_id}, user_id),
      total_amount = COALESCE(${data.total_amount}, total_amount),
      status = COALESCE(${data.status}, status),
      payment_status = COALESCE(${data.payment_status}, payment_status),
      notes = COALESCE(${data.notes}, notes),
      shipping_address = COALESCE(${shippingJson}::jsonb, shipping_address),
      invoice_url = COALESCE(${data.invoice_url}, invoice_url),
      invoice_id = COALESCE(${data.invoice_id}, invoice_id)
    WHERE id = ${id}
    RETURNING *
  `) as Order[]
  if (!result[0]) return null
  return (await getOrderById(id))
}

export async function deleteOrder(id: string): Promise<boolean> {
  await createOrdersTables()
  const result = await sql`DELETE FROM orders WHERE id = ${id}`
  return (result as any).rowCount > 0
}
