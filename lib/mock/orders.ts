export interface MockOrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name?: string;
  price_at_purchase?: number;
}

export interface MockOrder {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_status: 'paid' | 'unpaid' | 'refunded';
  created_at: string;
  order_items?: MockOrderItem[];
  notes?: string;
  shipping_address?: {
    name: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    zip_code: string;
    country?: string;
    phone?: string;
  };
}

export const mockOrders: MockOrder[] = [
  {
    id: '1',
    user_id: '1',
    total_amount: 300,
    status: 'pending',
    payment_status: 'unpaid',
    created_at: new Date().toISOString(),
    order_items: [
      { id: '1', product_id: '1', quantity: 1, price: 100, product_name: 'Mock Product 1', price_at_purchase: 100 },
      { id: '2', product_id: '2', quantity: 1, price: 200, product_name: 'Mock Product 2', price_at_purchase: 200 },
    ],
    notes: '',
    shipping_address: {
      name: 'Mock Customer',
      address_line1: '123 Mock St',
      city: 'Bangkok',
      state: '',
      zip_code: '10000',
      country: 'TH',
      phone: '000-0000',
    },
  },
];
