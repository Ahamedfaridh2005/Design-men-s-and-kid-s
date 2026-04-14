-- Create issue_tickets table
CREATE TABLE IF NOT EXISTS public.issue_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.issue_tickets ENABLE ROW LEVEL SECURITY;

-- Policies
-- Allow anyone (including anonymous users) to insert issue tickets
CREATE POLICY "Anyone can create issue tickets" ON public.issue_tickets FOR INSERT WITH CHECK (true);

-- Allow reading tickets (simplified for admin panel using anon key)
CREATE POLICY "Anyone can read issue tickets" ON public.issue_tickets FOR SELECT USING (true);

-- Enable Realtime for issue_tickets (needed for AdminIssues live updates)
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.issue_tickets;
