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
}
