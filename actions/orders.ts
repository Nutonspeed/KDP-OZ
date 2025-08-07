'use server'

import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { CartItem } from '@/lib/store';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  price_at_purchase: number;
  product_name?: string;
  product_image_url?: string;
  product_slug?: string;
  products?: any;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at?: string;
  notes?: string;
  shipping_address?: {
    name?: string;
    address_line1?: string;
    address_line2?: string | null;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    phone?: string;
  };
  order_items?: OrderItem[];
}

export async function fetchOrders(page: number = 1, limit: number = 10) {
  const supabase = createSupabaseAdminClient(); // Use admin client for fetching all orders
  const offset = (page - 1) * limit;

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching orders:', error.message);
      return { orders: [], totalCount: 0, error: error.message };
    }

    const { count, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error fetching order count:', countError.message);
      return { orders: [], totalCount: 0, error: countError.message };
    }

    return { orders: orders || [], totalCount: count || 0, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching orders:', error.message);
    return { orders: [], totalCount: 0, error: 'An unexpected error occurred.' };
  }
}

export async function fetchOrderById(orderId: string) {
  const supabase = createSupabaseServerClient(); // Use server client for RLS
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order by ID:', error.message);
      return { order: null, error: error.message };
    }
    return { order, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching order by ID:', error.message);
    return { order: null, error: 'An unexpected error occurred.' };
  }
}

export async function fetchOrderCount() {
  const supabase = createSupabaseAdminClient(); // Use admin client for count
  try {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching order count:', error.message);
      return { count: 0, error: error.message };
    }
    return { count: count || 0, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching order count:', error.message);
    return { count: 0, error: 'An unexpected error occurred.' };
  }
}

export async function fetchRecentOrders(limit: number) {
  const supabase = createSupabaseAdminClient();
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent orders:', error.message);
      return { orders: [], error: error.message };
    }

    return { orders: orders || [], error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching recent orders:', error.message);
    return { orders: [], error: 'An unexpected error occurred.' };
  }
}

export async function createOrder(userId: string, totalAmount: number, cartItems: CartItem[]) {
  const supabase = createSupabaseAdminClient(); // Use admin client for order creation and stock management
  try {
    // Start a transaction-like operation (Supabase doesn't have native transactions for RPC, so we do it manually)
    // First, create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: userId, total_amount: totalAmount, status: 'pending' })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError?.message);
      return { success: false, error: orderError?.message || 'Failed to create order.' };
    }

    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.base_price,
    }));

    // Then, insert order items
    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      console.error('Error creating order items:', orderItemsError.message);
      // Rollback order if order items fail (manual rollback)
      await supabase.from('orders').delete().eq('id', order.id);
      return { success: false, error: orderItemsError.message };
    }

    // Update product stock quantities
    for (const item of cartItems) {
      const { data: product, error: fetchProductError } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', item.id)
        .single();

      if (fetchProductError || !product) {
        console.error(`Error fetching product ${item.id} for stock update:`, fetchProductError?.message);
        // Consider rolling back if stock update fails for any item
        return { success: false, error: `Failed to fetch product ${item.name} for stock update.` };
      }

      const newStockQuantity = product.stock_quantity - item.quantity;
      if (newStockQuantity < 0) {
        // This should ideally be caught earlier in the cart validation
        console.error(`Insufficient stock for product ${item.name}. Available: ${product.stock_quantity}, Ordered: ${item.quantity}`);
        // Consider rolling back the entire order here
        return { success: false, error: `Insufficient stock for ${item.name}.` };
      }

      const { error: updateStockError } = await supabase
        .from('products')
        .update({ stock_quantity: newStockQuantity })
        .eq('id', item.id);

      if (updateStockError) {
        console.error(`Error updating stock for product ${item.id}:`, updateStockError.message);
        // Consider rolling back if stock update fails for any item
        return { success: false, error: `Failed to update stock for ${item.name}.` };
      }
    }

    revalidatePath('/admin/orders');
    revalidatePath('/order-history');
    revalidatePath('/products/[slug]', 'page'); // Revalidate product pages to reflect new stock
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error('Unexpected error creating order:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createSupabaseAdminClient(); // Use admin client for status updates
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/orders');
    revalidatePath('/order-history');
    return { success: true, order: data };
  } catch (error: any) {
    console.error('Unexpected error updating order status:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateOrder(orderId: string, updates: Partial<Order>) {
  const supabase = createSupabaseAdminClient();
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/orders');
    revalidatePath('/order-history');
    return { success: true, order: data };
  } catch (error: any) {
    console.error('Unexpected error updating order:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function deleteOrder(orderId: string) {
  const supabase = createSupabaseAdminClient();
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error('Error deleting order:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/orders');
    revalidatePath('/order-history');
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error deleting order:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function fetchUserOrders(userId: string) {
  const supabase = createSupabaseServerClient();
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error.message);
      return [] as Order[];
    }

    return (data as Order[]) || [];
  } catch (error: any) {
    console.error('Unexpected error fetching user orders:', error.message);
    return [] as Order[];
  }
}
