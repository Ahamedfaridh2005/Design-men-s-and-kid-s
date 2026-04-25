-- Create the product-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;



-- Allow public read access to the product-images bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow public insert access to the product-images bucket
CREATE POLICY "Public Insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow public update access to the product-images bucket
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- Allow public delete access to the product-images bucket
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');
