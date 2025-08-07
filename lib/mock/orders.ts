export interface MockOrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

export interface MockOrder {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items?: MockOrderItem[];
}

export const mockOrders: MockOrder[] = [
  {
    id: '1',
    user_id: '1',
    total_amount: 300,
    status: 'pending',
    created_at: new Date().toISOString(),
    order_items: [
      { product_id: '1', quantity: 1, price: 100 },
      { product_id: '2', quantity: 1, price: 200 },
    ],
  },
];
