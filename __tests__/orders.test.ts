import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient } from '@/lib/supabase';

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/lib/supabase', () => ({
  createSupabaseAdminClient: jest.fn(),
  createSupabaseServerClient: jest.fn(),
}));

import { createOrder, updateOrderStatus } from '../actions/orders';

describe('orders actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createOrder success', async () => {
    const mockFrom = jest.fn();
    const mockSupabase = { from: mockFrom } as any;
    (createSupabaseAdminClient as jest.Mock).mockReturnValue(mockSupabase);

    const insertOrder = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: { id: 'order1' }, error: null }),
      }),
    });

    const insertItems = jest.fn().mockResolvedValue({ error: null });

    const selectProduct = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: { stock_quantity: 10 }, error: null }),
      }),
    });

    const updateProduct = jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'orders') return { insert: insertOrder };
      if (table === 'order_items') return { insert: insertItems };
      if (table === 'products') return { select: selectProduct, update: updateProduct };
      return {};
    });

    const cartItems = [
      { id: 'prod1', quantity: 2, base_price: 5, name: 'Prod1', stock_quantity: 10 },
    ];

    const result = await createOrder('user1', 10, cartItems as any);

    expect(result).toEqual({ success: true, orderId: 'order1' });
    expect(revalidatePath).toHaveBeenCalledWith('/admin/orders');
    expect(revalidatePath).toHaveBeenCalledWith('/order-history');
    expect(revalidatePath).toHaveBeenCalledWith('/products/[slug]', 'page');
  });

  test('createOrder failure', async () => {
    const mockSupabase = { from: jest.fn() } as any;
    (createSupabaseAdminClient as jest.Mock).mockReturnValue(mockSupabase);

    const insertOrder = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'insert error' } }),
      }),
    });

    mockSupabase.from.mockReturnValueOnce({ insert: insertOrder });

    const result = await createOrder('user1', 10, []);

    expect(result).toEqual({ success: false, error: 'insert error' });
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  test('updateOrderStatus success', async () => {
    const mockSupabase = { from: jest.fn() } as any;
    (createSupabaseAdminClient as jest.Mock).mockReturnValue(mockSupabase);

    const updateOrder = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { id: 'order1', status: 'shipped' }, error: null }),
        }),
      }),
    });

    mockSupabase.from.mockReturnValueOnce({ update: updateOrder });

    const result = await updateOrderStatus('order1', 'shipped');

    expect(result).toEqual({ success: true, order: { id: 'order1', status: 'shipped' } });
    expect(revalidatePath).toHaveBeenCalledWith('/admin/orders');
    expect(revalidatePath).toHaveBeenCalledWith('/order-history');
  });

  test('updateOrderStatus failure', async () => {
    const mockSupabase = { from: jest.fn() } as any;
    (createSupabaseAdminClient as jest.Mock).mockReturnValue(mockSupabase);

    const updateOrder = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'update error' } }),
        }),
      }),
    });

    mockSupabase.from.mockReturnValueOnce({ update: updateOrder });

    const result = await updateOrderStatus('order1', 'shipped');

    expect(result).toEqual({ success: false, error: 'update error' });
  });
});
