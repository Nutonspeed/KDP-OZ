-- Create the 'users' table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed passwords (e.g., bcrypt)
    role VARCHAR(50) DEFAULT 'admin' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the 'products' table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    material VARCHAR(50),
    sizes TEXT[], -- Array of text for sizes
    base_price NUMERIC(10, 2) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    specifications JSONB, -- JSONB for flexible key-value pairs
    certifications TEXT[], -- Array of text for certifications
    applications TEXT[], -- Array of text for applications
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the 'leads' table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    product_interest TEXT,
    size VARCHAR(50),
    quantity VARCHAR(50),
    status VARCHAR(50) DEFAULT 'รอติดต่อ' NOT NULL, -- 'รอติดต่อ', 'กำลังเจรจา', 'ปิดการขาย'
    notes TEXT[], -- Array of text for notes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the 'pages' table for website content
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(50) DEFAULT 'draft' NOT NULL, -- 'draft', 'published', 'archived'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the 'banners' table
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    position VARCHAR(50) NOT NULL, -- 'hero', 'sidebar', 'footer'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the 'seo_settings' table (single row table)
CREATE TABLE IF NOT EXISTS seo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_title VARCHAR(255),
    site_description TEXT,
    keywords TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image TEXT,
    twitter_card VARCHAR(50),
    canonical_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to update 'updated_at' column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for 'updated_at' column
CREATE OR REPLACE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_pages_updated_at
BEFORE UPDATE ON pages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_seo_settings_updated_at
BEFORE UPDATE ON seo_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
