// Defines the shape of a discount or coupon code used during checkout.
// A coupon can apply a percentage-based discount or a fixed amount.
// The discount is only valid between valid_from and valid_to dates and may
// optionally require a minimum order value. The `max_uses` property limits how
// many times a coupon can be used across all orders, while `use_count`
// tracks how many times it has been redeemed.
export interface Coupon {
  id: string;
  code: string;
  description?: string;
  /**
   * A percentage discount represented as a decimal fraction (e.g., 0.1 for 10% off).
   * Only one of `discount_percentage` or `discount_amount` should be provided.
   */
  discount_percentage?: number;
  /**
   * A fixed discount amount to subtract from the order total. Use the same
   * currency as the cart. Only one of `discount_percentage` or `discount_amount` should be provided.
   */
  discount_amount?: number;
  /**
   * ISO string representing when the coupon becomes valid. If omitted, the coupon is valid immediately.
   */
  valid_from?: string;
  /**
   * ISO string representing when the coupon expires. If omitted, the coupon does not expire.
   */
  valid_to?: string;
  /**
   * Minimum order value required to apply this coupon. If the order total is below this value,
   * the coupon cannot be applied.
   */
  min_order_value?: number;
  /**
   * Maximum number of times the coupon can be used across all customers. If omitted,
   * the coupon can be used unlimited times.
   */
  max_uses?: number;
  /**
   * Tracks how many times the coupon has been used. This is updated each time
   * the coupon is applied to an order.
   */
  use_count?: number;
}