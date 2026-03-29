
-- Allow users to delete their own waste matches
CREATE POLICY "Users delete own matches" ON public.waste_matches FOR DELETE USING (auth.uid() = farmer_id);
