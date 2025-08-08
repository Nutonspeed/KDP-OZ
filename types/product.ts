export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  base_price: number;
  image_url?: string;
  category?: string;
  type?: string;
  material?: string;
  sizes: string[];
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
  stock_quantity: number; // Added for inventory management

  /**
   * A list of tags associated with the product. Tags allow for more flexible
   * grouping and filtering of products beyond a single category. For example,
   * a product could have tags like `['promotion', 'new', 'clearance']`.
   */
  tags?: string[];

  /**
   * An optional discounted price for the product. When provided, this value
   * should be used instead of `base_price` during promotions or sales.
   */
  discount_price?: number;

  /**
   * The start date of a sale or promotional period, represented as an ISO
   * formatted string (e.g., `2025-08-01T00:00:00Z`). If specified, the
   * discounted price applies from this date onward until `sale_end_date`.
   */
  sale_start_date?: string;

  /**
   * The end date of a sale or promotional period, represented as an ISO
   * formatted string. When the current date is after this date, the
   * product should revert to using `base_price` rather than the
   * discounted price.
   */
  sale_end_date?: string;
}
