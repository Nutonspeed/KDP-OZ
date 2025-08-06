ALTER TABLE public.products
ADD COLUMN image_url text;

-- Optional: Add a policy to allow users to update their own product images if needed,
-- but for admin panel, existing admin update policy should suffice.
-- If you want to allow public read access to product images in Supabase Storage,
-- ensure your storage bucket policies are configured accordingly.
