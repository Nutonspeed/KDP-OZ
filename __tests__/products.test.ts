import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase';

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  createSupabaseAdminClient: jest.fn(),
  createSupabaseServerClient: jest.fn(),
}));

import { fetchProducts, addProduct } from '../actions/products';

describe('products actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchProducts success', async () => {
    const mockSupabase = { from: jest.fn() } as any;
    (createSupabaseServerClient as jest.Mock).mockReturnValue(mockSupabase);

    const rangeMock = jest.fn().mockResolvedValue({ data: [{ id: 'p1' }], error: null });
    const orderMock = jest.fn().mockReturnValue({ range: rangeMock });
    const selectMock = jest.fn().mockReturnValue({ order: orderMock });
    mockSupabase.from.mockReturnValueOnce({ select: selectMock });

    const selectCountMock = jest.fn().mockResolvedValue({ count: 1, error: null });
    mockSupabase.from.mockReturnValueOnce({ select: selectCountMock });

    const result = await fetchProducts(1, 10);

    expect(result).toEqual({ products: [{ id: 'p1' }], totalCount: 1, error: null });
  });

  test('fetchProducts failure', async () => {
    const mockSupabase = { from: jest.fn() } as any;
    (createSupabaseServerClient as jest.Mock).mockReturnValue(mockSupabase);

    const rangeMock = jest.fn().mockResolvedValue({ data: null, error: { message: 'fetch error' } });
    const orderMock = jest.fn().mockReturnValue({ range: rangeMock });
    const selectMock = jest.fn().mockReturnValue({ order: orderMock });
    mockSupabase.from.mockReturnValueOnce({ select: selectMock });

    const result = await fetchProducts();

    expect(result).toEqual({ products: [], totalCount: 0, error: 'fetch error' });
  });

  test('addProduct success', async () => {
    const mockSupabase = { from: jest.fn() } as any;
    (createSupabaseAdminClient as jest.Mock).mockReturnValue(mockSupabase);

    const insertMock = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: { id: 'p1', name: 'Prod' }, error: null }),
      }),
    });

    mockSupabase.from.mockReturnValueOnce({ insert: insertMock });

    const productData = {
      name: 'Prod',
      slug: 'prod',
      base_price: 10,
      stock_quantity: 5,
      description: '',
      image_url: '',
      category: '',
      type: '',
      material: '',
      is_featured: false,
    } as any;

    const result = await addProduct(productData);

    expect(result).toEqual({ success: true, product: { id: 'p1', name: 'Prod' } });
    expect(revalidatePath).toHaveBeenCalledWith('/admin/products');
    expect(revalidatePath).toHaveBeenCalledWith('/products');
  });

  test('addProduct failure', async () => {
    const mockSupabase = { from: jest.fn() } as any;
    (createSupabaseAdminClient as jest.Mock).mockReturnValue(mockSupabase);

    const insertMock = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'insert error' } }),
      }),
    });

    mockSupabase.from.mockReturnValueOnce({ insert: insertMock });

    const result = await addProduct({} as any);

    expect(result).toEqual({ success: false, error: 'insert error' });
  });
});
