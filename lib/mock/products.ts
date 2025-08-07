import { Product } from '@/types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Mock Product A',
    slug: 'mock-product-a',
    description: 'Mock product A description',
    type: 'A',
    material: 'Aluminum',
    sizes: ['1/2', '3/4'],
    base_price: 100,
    category: 'Standard',
    image_url: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stock_quantity: 10,
  },
  {
    id: '2',
    name: 'Mock Product B',
    slug: 'mock-product-b',
    description: 'Mock product B description',
    type: 'B',
    material: 'Steel',
    sizes: ['1'],
    base_price: 200,
    category: 'Standard',
    image_url: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    stock_quantity: 5,
  },
];
