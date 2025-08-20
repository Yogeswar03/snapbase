-- Migration: Add startup_team_members table
CREATE TABLE public.startup_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS: Only allow startup owner to view/insert/update/delete their team members
ALTER TABLE public.startup_team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team: owner can view" ON public.startup_team_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND owner_id = auth.uid())
);
CREATE POLICY "Team: owner can insert" ON public.startup_team_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND owner_id = auth.uid())
);
CREATE POLICY "Team: owner can update" ON public.startup_team_members FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND owner_id = auth.uid())
);
CREATE POLICY "Team: owner can delete" ON public.startup_team_members FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND owner_id = auth.uid())
);
