-- Remove stock column
ALTER TABLE public.products DROP COLUMN IF EXISTS stock;

-- Add discount column
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount NUMERIC DEFAULT 0;

-- Add sizes column (as an array of text)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes TEXT[] DEFAULT '{}';

-- Update existing rows with dummy values
UPDATE public.products 
SET 
    discount = 0,
    sizes = ARRAY['S', 'M', 'L', 'XL']
WHERE sizes = '{}' OR sizes IS NULL;
