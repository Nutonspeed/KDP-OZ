-- Add stock_quantity column if it does not already exist
ALTER TABLE products
ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT 0;

-- Optional: Update existing products to have a default stock quantity if needed
-- This part is safe to run multiple times as it only updates NULL values or sets a default
-- UPDATE products SET stock_quantity = 10 WHERE stock_quantity IS NULL;
