CREATE TABLE public.training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  scenario text NOT NULL,
  transcript jsonb NOT NULL DEFAULT '[]'::jsonb,
  overall_score integer,
  feedback jsonb,
  duration_seconds integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own training sessions"
  ON public.training_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own training sessions"
  ON public.training_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own training sessions"
  ON public.training_sessions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);