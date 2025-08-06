-- Create 'leads' table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    company TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    product_interest TEXT NOT NULL,
    size TEXT,
    quantity TEXT,
    status TEXT NOT NULL DEFAULT 'รอติดต่อ', -- 'รอติดต่อ', 'กำลังเจรจา', 'ปิดการขาย'
    notes TEXT[] DEFAULT ARRAY[]::TEXT[],
    address TEXT
);

-- Create 'products' table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'LB', 'C', 'T', 'LL', 'LR'
    material TEXT NOT NULL, -- 'Aluminum', 'Iron', 'Stainless Steel'
    sizes TEXT[] DEFAULT ARRAY[]::TEXT[],
    base_price NUMERIC NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

-- Create 'pages' table
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' -- 'draft', 'published', 'archived'
);

-- Create 'banners' table
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    position TEXT NOT NULL DEFAULT 'hero' -- 'hero', 'sidebar', 'footer'
);

-- Create 'seo_settings' table (assuming only one row for global settings)
CREATE TABLE IF NOT EXISTS seo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    site_title TEXT NOT NULL,
    site_description TEXT,
    keywords TEXT,
    canonical_url TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    twitter_card TEXT -- 'summary', 'summary_large_image'
);

-- Insert initial SEO settings if the table is empty
INSERT INTO seo_settings (site_title, site_description, keywords, canonical_url, og_title, og_description, og_image, twitter_card)
SELECT 'Conduit Body Website', 'เว็บไซต์สำหรับจำหน่าย Conduit Body คุณภาพสูง', 'conduit body, electrical, industrial', 'https://yourwebsite.com', 'Conduit Body Website', 'เว็บไซต์สำหรับจำหน่าย Conduit Body คุณภาพสูง', 'https://yourwebsite.com/og-image.jpg', 'summary_large_image'
WHERE NOT EXISTS (SELECT 1 FROM seo_settings);

-- Set up Row Level Security (RLS) for tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Policies for 'leads' table
-- Allow authenticated users to read leads
CREATE POLICY "Allow authenticated read access to leads" ON leads
FOR SELECT USING (auth.role() = 'authenticated');
-- Allow authenticated users to update leads
CREATE POLICY "Allow authenticated update access to leads" ON leads
FOR UPDATE USING (auth.role() = 'authenticated');
-- Allow authenticated users to insert leads (e.g., from a public form)
CREATE POLICY "Allow authenticated insert access to leads" ON leads
FOR INSERT WITH CHECK (true); -- Or add specific conditions if needed

-- Policies for 'products' table
-- Allow all users to read products
CREATE POLICY "Allow public read access to products" ON products
FOR SELECT USING (true);
-- Allow authenticated users to insert, update, delete products
CREATE POLICY "Allow authenticated manage access to products" ON products
FOR ALL USING (auth.role() = 'authenticated');

-- Policies for 'pages' table
-- Allow all users to read published pages
CREATE POLICY "Allow public read access to published pages" ON pages
FOR SELECT USING (status = 'published');
-- Allow authenticated users to manage pages
CREATE POLICY "Allow authenticated manage access to pages" ON pages
FOR ALL USING (auth.role() = 'authenticated');

-- Policies for 'banners' table
-- Allow all users to read active banners
CREATE POLICY "Allow public read access to active banners" ON banners
FOR SELECT USING (active = TRUE);
-- Allow authenticated users to manage banners
CREATE POLICY "Allow authenticated manage access to banners" ON banners
FOR ALL USING (auth.role() = 'authenticated');

-- Policies for 'seo_settings' table
-- Allow all users to read SEO settings
CREATE POLICY "Allow public read access to SEO settings" ON seo_settings
FOR SELECT USING (true);
-- Allow authenticated users to update SEO settings
CREATE POLICY "Allow authenticated update access to SEO settings" ON seo_settings
FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a function to update 'updated_at' column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for 'updated_at' column
CREATE OR REPLACE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_pages_updated_at
BEFORE UPDATE ON pages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_banners_updated_at
BEFORE UPDATE ON banners
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_seo_settings_updated_at
BEFORE UPDATE ON seo_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
