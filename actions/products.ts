'use server'

import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { Product } from '@/types/product';

export async function fetchProducts(page: number = 1, limit: number = 10) {
  const supabase = createSupabaseServerClient(); // Use server client for RLS
  const offset = (page - 1) * limit;

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching products:', error.message);
      return { products: [], totalCount: 0, error: error.message };
    }

    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error fetching product count:', countError.message);
      return { products: [], totalCount: 0, error: countError.message };
    }

    return { products: products || [], totalCount: count || 0, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching products:', error.message);
    return { products: [], totalCount: 0, error: 'An unexpected error occurred.' };
  }
}

export async function fetchProductBySlug(slug: string) {
  const supabase = createSupabaseServerClient();
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching product by slug:', error.message);
      return { product: null, error: error.message };
    }
    return { product, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching product by slug:', error.message);
    return { product: null, error: 'An unexpected error occurred.' };
  }
}

export async function fetchProductCount() {
  const supabase = createSupabaseAdminClient(); // Use admin client for count
  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching product count:', error.message);
      return { count: 0, error: error.message };
    }
    return { count: count || 0, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching product count:', error.message);
    return { count: 0, error: 'An unexpected error occurred.' };
  }
}

// Renamed from createProduct to addProduct
export async function addProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createSupabaseAdminClient(); // Use admin client for mutations
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true, product: data };
  } catch (error: any) {
    console.error('Unexpected error creating product:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'created_at'>>) {
  const supabase = createSupabaseAdminClient(); // Use admin client for mutations
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ ...productData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath(`/products/${data.slug}`);
    return { success: true, product: data };
  } catch (error: any) {
    console.error('Unexpected error updating product:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function deleteProduct(id: string) {
  const supabase = createSupabaseAdminClient(); // Use admin client for mutations
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error.message);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error deleting product:', error.message);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
