-- Create enums for structured data
CREATE TYPE public.user_role AS ENUM ('admin', 'founder');
CREATE TYPE public.startup_stage AS ENUM ('idea', 'prototype', 'mvp', 'early_stage', 'growth', 'mature');
CREATE TYPE public.startup_sector AS ENUM ('saas', 'fintech', 'healthtech', 'edtech', 'ecommerce', 'marketplace', 'ai_ml', 'biotech', 'other');
CREATE TYPE public.model_kind AS ENUM ('profit', 'growth', 'failure');
CREATE TYPE public.alert_type AS ENUM ('death_zone', 'cashflow_low', 'runway_low');
CREATE TYPE public.alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.opportunity_type AS ENUM ('investor', 'grant', 'partner');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role public.user_role NOT NULL DEFAULT 'founder',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create startups table
CREATE TABLE public.startups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sector public.startup_sector NOT NULL,
  stage public.startup_stage NOT NULL,
  team_experience INTEGER DEFAULT 0, -- in months
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create metrics table for startup financial data
CREATE TABLE public.metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  revenue DECIMAL(15,2) NOT NULL DEFAULT 0,
  expenses DECIMAL(15,2) NOT NULL DEFAULT 0,
  burn_rate DECIMAL(15,2) NOT NULL DEFAULT 0,
  runway INTEGER DEFAULT 0, -- in months
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create models table to track ML model versions
CREATE TABLE public.models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE,
  kind public.model_kind NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  model_path TEXT, -- path to stored model file
  accuracy DECIMAL(5,4), -- model accuracy score
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create predictions table to store ML predictions
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  input_data JSONB NOT NULL, -- input features used for prediction
  output_data JSONB NOT NULL, -- prediction results
  profit_loss DECIMAL(15,2),
  growth_rate DECIMAL(5,2),
  failure_probability DECIMAL(5,4),
  cashflow DECIMAL(15,2),
  runway_months INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table for risk notifications
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  type public.alert_type NOT NULL,
  message TEXT NOT NULL,
  severity public.alert_severity NOT NULL DEFAULT 'medium',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create opportunities table for growth recommendations
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  type public.opportunity_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  score DECIMAL(3,2) DEFAULT 0, -- relevance score 0-1
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for startups
CREATE POLICY "Users can view their own startups" 
ON public.startups FOR SELECT 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can create startups" 
ON public.startups FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own startups" 
ON public.startups FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own startups" 
ON public.startups FOR DELETE 
USING (auth.uid() = owner_id);

-- Create RLS policies for metrics
CREATE POLICY "Users can view metrics for their startups" 
ON public.metrics FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.startups 
  WHERE id = startup_id AND owner_id = auth.uid()
));

CREATE POLICY "Users can create metrics for their startups" 
ON public.metrics FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.startups 
  WHERE id = startup_id AND owner_id = auth.uid()
));

CREATE POLICY "Users can update metrics for their startups" 
ON public.metrics FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.startups 
  WHERE id = startup_id AND owner_id = auth.uid()
));

CREATE POLICY "Users can delete metrics for their startups" 
ON public.metrics FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.startups 
  WHERE id = startup_id AND owner_id = auth.uid()
));

-- Create RLS policies for models
CREATE POLICY "Users can view models for their startups" 
ON public.models FOR SELECT 
USING (
  startup_id IS NULL OR 
  EXISTS (
    SELECT 1 FROM public.startups 
    WHERE id = startup_id AND owner_id = auth.uid()
  )
);

CREATE POLICY "Users can create models for their startups" 
ON public.models FOR INSERT 
WITH CHECK (
  startup_id IS NULL OR 
  EXISTS (
    SELECT 1 FROM public.startups 
    WHERE id = startup_id AND owner_id = auth.uid()
  )
);

-- Create RLS policies for predictions
CREATE POLICY "Users can view predictions for their startups" 
ON public.predictions FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.startups 
  WHERE id = startup_id AND owner_id = auth.uid()
));

CREATE POLICY "Users can create predictions for their startups" 
ON public.predictions FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.startups 
  WHERE id = startup_id AND owner_id = auth.uid()
));

-- Create RLS policies for alerts
CREATE POLICY "Users can view alerts for their startups" 
ON public.alerts FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.startups 
  WHERE id = startup_id AND owner_id = auth.uid()
));

CREATE POLICY "Users can update alerts for their startups" 
ON public.alerts FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.startups 
  WHERE id = startup_id AND owner_id = auth.uid()
));

-- Create RLS policies for opportunities
CREATE POLICY "Users can view opportunities for their startups" 
ON public.opportunities FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.startups 
  WHERE id = startup_id AND owner_id = auth.uid()
));

CREATE POLICY "Users can update opportunities for their startups" 
ON public.opportunities FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.startups 
  WHERE id = startup_id AND owner_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_startups_updated_at
  BEFORE UPDATE ON public.startups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_startups_owner_id ON public.startups(owner_id);
CREATE INDEX idx_metrics_startup_id ON public.metrics(startup_id);
CREATE INDEX idx_metrics_period ON public.metrics(period_start, period_end);
CREATE INDEX idx_predictions_startup_id ON public.predictions(startup_id);
CREATE INDEX idx_predictions_created_at ON public.predictions(created_at);
CREATE INDEX idx_alerts_startup_id ON public.alerts(startup_id);
CREATE INDEX idx_alerts_unread ON public.alerts(startup_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_opportunities_startup_id ON public.opportunities(startup_id);