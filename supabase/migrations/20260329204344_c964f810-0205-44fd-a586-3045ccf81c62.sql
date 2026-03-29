
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  aadhar_number TEXT,
  date_of_birth DATE,
  location TEXT,
  user_type TEXT NOT NULL DEFAULT 'farmer' CHECK (user_type IN ('farmer', 'cattle_owner', 'buyer', 'transporter')),
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'te', 'hi', 'mr', 'kn')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Community posts (AgroConnect)
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_type TEXT NOT NULL CHECK (post_type IN ('waste_available', 'fodder_needed', 'manure_exchange')),
  title TEXT NOT NULL,
  description TEXT,
  quantity_kg NUMERIC,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts viewable by everyone" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Users create own posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Waste matches (Urban Waste Matcher)
CREATE TABLE public.waste_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_name TEXT NOT NULL,
  buyer_type TEXT NOT NULL CHECK (buyer_type IN ('hotel', 'industry', 'local_buyer')),
  crop_type TEXT NOT NULL,
  quantity_kg NUMERIC,
  price_per_kg NUMERIC,
  distance_km NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.waste_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own matches" ON public.waste_matches FOR SELECT USING (auth.uid() = farmer_id);
CREATE POLICY "Users insert matches" ON public.waste_matches FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Users update own matches" ON public.waste_matches FOR UPDATE USING (auth.uid() = farmer_id);

-- Carbon activities
CREATE TABLE public.carbon_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('composting', 'no_burning', 'tree_planting', 'organic_farming', 'water_conservation')),
  co2_saved_kg NUMERIC NOT NULL DEFAULT 0,
  credits_earned INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.carbon_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own carbon" ON public.carbon_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert carbon" ON public.carbon_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Viability scans
CREATE TABLE public.viability_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_type TEXT,
  image_url TEXT,
  usable_percentage NUMERIC,
  damage_level TEXT CHECK (damage_level IN ('minimal', 'low', 'moderate', 'high', 'severe')),
  ai_suggestion TEXT,
  ai_analysis TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.viability_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own scans" ON public.viability_scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert scans" ON public.viability_scans FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insurance claims
CREATE TABLE public.insurance_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claim_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  aadhar_number TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  crop_type TEXT NOT NULL,
  estimated_loss NUMERIC NOT NULL,
  damage_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'processing', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own claims" ON public.insurance_claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert claims" ON public.insurance_claims FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own claims" ON public.insurance_claims FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.insurance_claims FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('buyer_match', 'fodder_request', 'claim_update', 'carbon_credit', 'general')),
  title TEXT NOT NULL,
  description TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Chat messages (AI assistant history)
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES ('crop-images', 'crop-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('claim-images', 'claim-images', true);

CREATE POLICY "Anyone can view crop images" ON storage.objects FOR SELECT USING (bucket_id = 'crop-images');
CREATE POLICY "Auth users upload crop images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'crop-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can view claim images" ON storage.objects FOR SELECT USING (bucket_id = 'claim-images');
CREATE POLICY "Auth users upload claim images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'claim-images' AND auth.uid() IS NOT NULL);
