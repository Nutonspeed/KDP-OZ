'use server'

import { createSupabaseServerClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

interface PageContent {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  status: 'draft' | 'published' | 'archived';
}

interface BannerContent {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  active: boolean;
  position: 'hero' | 'sidebar' | 'footer';
}

interface SeoSettings {
  id: string;
  updated_at: string;
  site_title: string;
  site_description?: string;
  keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card?: string;
}

// --- Page Content Actions ---
export async function fetchPages(): Promise<PageContent[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pages:', error.message);
    return [];
  }
  return data as PageContent[];
}

export async function createPage(pageData: Omit<PageContent, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('pages')
    .insert({
      title: pageData.title,
      slug: pageData.slug,
      content: pageData.content,
      meta_title: pageData.meta_title,
      meta_description: pageData.meta_description,
      status: pageData.status,
    });

  if (error) {
    console.error('Error creating page:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/content');
  return { success: true };
}

export async function updatePage(pageId: string, pageData: Partial<Omit<PageContent, 'id' | 'created_at' | 'updated_at'>>) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('pages')
    .update(pageData)
    .eq('id', pageId);

  if (error) {
    console.error('Error updating page:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/content');
  revalidatePath(`/${pageData.slug}`); // Revalidate the public page if slug changed or content updated
  return { success: true };
}

export async function deletePage(pageId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', pageId);

  if (error) {
    console.error('Error deleting page:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/content');
  return { success: true };
}

// --- Banner Content Actions ---
export async function fetchBanners(): Promise<BannerContent[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching banners:', error.message);
    return [];
  }
  return data as BannerContent[];
}

export async function createBanner(bannerData: Omit<BannerContent, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('banners')
    .insert({
      title: bannerData.title,
      description: bannerData.description,
      image_url: bannerData.image_url,
      link_url: bannerData.link_url,
      active: bannerData.active,
      position: bannerData.position,
    });

  if (error) {
    console.error('Error creating banner:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/content');
  return { success: true };
}

export async function updateBanner(bannerId: string, bannerData: Partial<Omit<BannerContent, 'id' | 'created_at' | 'updated_at'>>) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('banners')
    .update(bannerData)
    .eq('id', bannerId);

  if (error) {
    console.error('Error updating banner:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/content');
  return { success: true };
}

export async function deleteBanner(bannerId: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', bannerId);

  if (error) {
    console.error('Error deleting banner:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/content');
  return { success: true };
}

// --- SEO Settings Actions ---
export async function fetchSeoSettings(): Promise<SeoSettings | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('seo_settings')
    .select('*')
    .limit(1)
    .single(); // Assuming only one row for global settings

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error('Error fetching SEO settings:', error.message);
    return null;
  }
  return data as SeoSettings | null;
}

export async function updateSEO(seoData: Omit<SeoSettings, 'id' | 'updated_at'>) {
  const supabase = createSupabaseServerClient();

  // First, try to fetch the existing settings to get its ID
  const { data: existingSettings, error: fetchError } = await supabase
    .from('seo_settings')
    .select('id')
    .limit(1)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error checking existing SEO settings:', fetchError.message);
    return { success: false, error: fetchError.message };
  }

  let error;
  if (existingSettings) {
    // If settings exist, update them
    const { error: updateError } = await supabase
      .from('seo_settings')
      .update(seoData)
      .eq('id', existingSettings.id);
    error = updateError;
  } else {
    // If no settings exist, insert new ones
    const { error: insertError } = await supabase
      .from('seo_settings')
      .insert(seoData);
    error = insertError;
  }

  if (error) {
    console.error('Error updating/inserting SEO settings:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/content');
  revalidatePath('/'); // Revalidate homepage as SEO settings affect it
  return { success: true };
}
