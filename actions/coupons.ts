import { mockCoupons } from '@/lib/mockDb'
import type { Coupon } from '@/types/coupon'

export interface CouponListResult {
  coupons: Coupon[]
  totalCount: number
  error: string | null
}

/**
 * Fetch a paginated list of coupons. Returns a slice of the mockCoupons array
 * along with the total count. No database filtering is applied aside from
 * pagination.
 */
export async function fetchCoupons(page: number = 1, limit: number = 10): Promise<CouponListResult> {
  const offset = (page - 1) * limit
  const coupons = mockCoupons.slice(offset, offset + limit)
  return { coupons, totalCount: mockCoupons.length, error: null }
}

/**
 * Retrieve a coupon by its code. If the coupon does not exist or is expired,
 * returns an error. Does not increment the usage count.
 */
export async function fetchCouponByCode(code: string): Promise<{ coupon: Coupon | null; error: string | null }> {
  const normalized = code.trim().toUpperCase()
  const coupon = mockCoupons.find((c) => c.code.toUpperCase() === normalized) || null
  if (!coupon) return { coupon: null, error: 'Coupon not found' }
  const now = new Date()
  if (coupon.valid_from && now < new Date(coupon.valid_from)) {
    return { coupon: null, error: 'Coupon not yet valid' }
  }
  if (coupon.valid_to && now > new Date(coupon.valid_to)) {
    return { coupon: null, error: 'Coupon has expired' }
  }
  if (coupon.max_uses !== undefined && coupon.use_count !== undefined && coupon.use_count >= coupon.max_uses) {
    return { coupon: null, error: 'Coupon usage limit reached' }
  }
  return { coupon, error: null }
}

/**
 * Create a new coupon and add it to the mock database. Generates an id and sets
 * initial use_count to 0. Returns the created coupon.
 */
export async function createCoupon(data: Omit<Coupon, 'id' | 'use_count'>): Promise<{ success: boolean; coupon?: Coupon; error?: string }> {
  const id = (mockCoupons.length + 1).toString()
  const newCoupon: Coupon = { ...data, id, use_count: 0 }
  mockCoupons.push(newCoupon)
  return { success: true, coupon: newCoupon }
}

/**
 * Update an existing coupon by ID. Returns success or error if not found.
 */
export async function updateCoupon(id: string, updates: Partial<Coupon>): Promise<{ success: boolean; error?: string }> {
  const index = mockCoupons.findIndex((c) => c.id === id)
  if (index === -1) return { success: false, error: 'Coupon not found' }
  const existing = mockCoupons[index]
  mockCoupons[index] = { ...existing, ...updates }
  return { success: true }
}

/**
 * Delete a coupon from the mock database by ID. Returns success or error if not found.
 */
export async function deleteCoupon(id: string): Promise<{ success: boolean; error?: string }> {
  const index = mockCoupons.findIndex((c) => c.id === id)
  if (index === -1) return { success: false, error: 'Coupon not found' }
  mockCoupons.splice(index, 1)
  return { success: true }
}

/**
 * Fetch the total number of coupons. Useful for dashboard summaries.
 */
export async function fetchCouponCount(): Promise<{ count: number; error: string | null }> {
  return { count: mockCoupons.length, error: null }
}

/**
 * Apply a coupon to a given order total. Validates the coupon and calculates
 * the discount amount. If the coupon is valid and applicable, increments its
 * use_count and returns the discount. Otherwise returns an error.
 */
export async function applyCoupon(
  code: string,
  orderTotal: number
): Promise<{ success: boolean; discount: number; coupon?: Coupon; error?: string }> {
  const { coupon, error } = await fetchCouponByCode(code)
  if (!coupon) {
    return { success: false, discount: 0, error: error || 'Invalid coupon' }
  }
  // Check minimum order requirement
  const min = coupon.min_order_value ?? 0
  if (orderTotal < min) {
    return { success: false, discount: 0, error: `Minimum order value for this coupon is $${min.toFixed(2)}` }
  }
  let discount = 0
  if (coupon.discount_percentage !== undefined) {
    discount = orderTotal * coupon.discount_percentage
  } else if (coupon.discount_amount !== undefined) {
    discount = coupon.discount_amount
  }
  // Ensure discount does not exceed order total
  discount = Math.min(discount, orderTotal)
  // Increment usage
  const index = mockCoupons.findIndex((c) => c.id === coupon.id)
  if (index !== -1) {
    const useCount = mockCoupons[index].use_count ?? 0
    mockCoupons[index].use_count = useCount + 1
  }
  return { success: true, discount, coupon }
}