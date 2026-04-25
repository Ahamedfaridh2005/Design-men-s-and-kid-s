
-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Update RLS policies to allow admins to see all profiles (optional but useful)
-- For now, let's just make sure admins can access admin tables.

-- We can also create a policy for admin_invoices to only allow admins
DROP POLICY IF EXISTS "Invoices are fully manageable by all" ON public.admin_invoices;
CREATE POLICY "Invoices are fully manageable by admins only" ON public.admin_invoices
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Similarly for products if needed
DROP POLICY IF EXISTS "Products are editable by all" ON public.products;
CREATE POLICY "Products are editable by admins only" ON public.products
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);
