-- Enable Row Level Security for the storage bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a policy for authenticated users to insert (upload) files
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Create a policy for everyone to select (read) files
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Optional: Policy for authenticated users to update their own files (if needed)
-- CREATE POLICY "Authenticated users can update their own product images"
-- ON storage.objects FOR UPDATE
-- TO authenticated
-- USING (bucket_id = 'product-images' AND auth.uid() = owner_id);

-- Optional: Policy for authenticated users to delete their own files (if needed)
-- CREATE POLICY "Authenticated users can delete their own product images"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'product-images' AND auth.uid() = owner_id);

-- Note: For product images, typically only admin users should upload/update/delete.
-- The 'Authenticated users can upload' policy is broad. For stricter control,
-- you might want to check for specific roles (e.g., 'admin' role) if implemented.
-- For now, 'authenticated' is used as per previous setup.
