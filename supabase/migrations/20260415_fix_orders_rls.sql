-- Drop restricted select policy if it exists
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Allow all authenticated users (or anyone in this demo) to view all orders 
-- so the Admin dashboard can actually see orders from all customers!
CREATE POLICY "Enable SELECT for all users" ON public.orders FOR SELECT USING (true);

-- Allow updates to the orders table so the admin status dropdown works
CREATE POLICY "Enable UPDATE for all users" ON public.orders FOR UPDATE USING (true);
