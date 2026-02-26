
CREATE TABLE public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month TEXT NOT NULL, -- format: YYYY-MM
  minutes_used NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, month)
);

ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Users can read their own usage
CREATE POLICY "Users can read own usage"
  ON public.usage_tracking
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can insert/update (via edge functions)
CREATE POLICY "Service role full access"
  ON public.usage_tracking
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
