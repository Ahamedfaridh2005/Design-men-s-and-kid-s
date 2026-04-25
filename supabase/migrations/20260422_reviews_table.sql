-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    user_role TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Reviews Policies
CREATE POLICY "Public reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Everyone can create reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- Insert initial reviews
INSERT INTO public.reviews (user_name, user_role, rating, content) VALUES 
('Sarah Jenkins', 'Interior Designer', 5, 'The stunning details of the basin perfectly elevated my master bathroom to a 5-star hotel level. Utterly flawless craftsmanship.'),
('Michael K.', 'Homeowner', 5, 'Their premium shower heads deliver incredible water pressure while looking exceptionally sleek. Best investment for our renovation.'),
('Elena Roberts', 'Architect', 5, 'Customer support was fantastic. They helped me perfectly match the luxury ceramics for our new commercial spa project. Spectacular!')
ON CONFLICT DO NOTHING;
