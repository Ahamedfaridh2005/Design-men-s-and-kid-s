-- Create DB Migration

-- Creating products table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    gender TEXT NOT NULL,
    image_url TEXT,
    description TEXT,
    stock INTEGER DEFAULT 10,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creating admin invoices table
CREATE TABLE IF NOT EXISTS public.admin_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_details JSONB DEFAULT '{}'::jsonb,
    items JSONB DEFAULT '[]'::jsonb,
    total NUMERIC NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invoices ENABLE ROW LEVEL SECURITY;

-- Products Policies
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products are editable by all" ON public.products FOR ALL USING (true);


-- Invoices Policies
-- Using true for testing/simplicity but should be admin only in production.
CREATE POLICY "Invoices are fully manageable by all" ON public.admin_invoices FOR ALL USING (true);

-- Insert initial products
INSERT INTO public.products (id, name, price, category, gender, image_url, description) VALUES 
('m1', 'Noir Slim Fit Shirt', 4999, 'Shirts', 'men', 'mens-shirt-1.jpg', 'Premium black slim-fit cotton shirt with a refined finish.'),
('m2', 'Ivory Linen Blazer', 12999, 'Blazers', 'men', 'mens-blazer-1.jpg', 'Luxurious beige linen blazer for the modern gentleman.'),
('m3', 'Essential White Tee', 2499, 'T-Shirts', 'men', 'mens-tshirt-1.jpg', 'Ultra-soft premium cotton t-shirt in pristine white.'),
('w1', 'Noir Cocktail Dress', 9999, 'Dresses', 'women', 'womens-dress-1.jpg', 'Elegant black cocktail dress with flowing silhouette.'),
('w2', 'Silk Champagne Blouse', 6499, 'Tops', 'women', 'womens-top-1.jpg', 'Luxurious silk blouse in soft champagne hue.'),
('k1', 'Play-Ready T-Shirt', 999, 'T-Shirts', 'kids', 'kids-tshirt.png', 'Durable and breathable organic cotton t-shirt for active kids.')
ON CONFLICT (id) DO NOTHING;
