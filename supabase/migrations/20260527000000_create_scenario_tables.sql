-- Migration Draft: Create Scenario Persistence Tables for Pattern Amp V1
-- Target Database: Supabase/PostgreSQL

-- Enable random uuid generator if not loaded
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

---------------------------------------------------------
-- 1. scenario_pattern_states
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS scenario_pattern_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  mode TEXT NOT NULL DEFAULT 'hypotheses_only',
  pattern_state JSONB NOT NULL,
  source_table_status JSONB NOT NULL DEFAULT '{}'::jsonb,
  data_completeness NUMERIC NOT NULL DEFAULT 0,
  warnings JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for scenario_pattern_states
ALTER TABLE scenario_pattern_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_pattern_states ON scenario_pattern_states
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY service_write_pattern_states ON scenario_pattern_states
  FOR ALL TO service_role USING (true) WITH CHECK (true);


---------------------------------------------------------
-- 2. scenario_seed_documents
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS scenario_seed_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  pattern_state_id UUID REFERENCES scenario_pattern_states(id) ON DELETE SET NULL,
  seed_markdown TEXT NOT NULL,
  seed_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  missing_data_warnings JSONB NOT NULL DEFAULT '[]'::jsonb,
  forbidden_inferences JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for scenario_seed_documents
ALTER TABLE scenario_seed_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_seed_documents ON scenario_seed_documents
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY service_write_seed_documents ON scenario_seed_documents
  FOR ALL TO service_role USING (true) WITH CHECK (true);


---------------------------------------------------------
-- 3. scenario_runs
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS scenario_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  pattern_state_id UUID REFERENCES scenario_pattern_states(id) ON DELETE SET NULL,
  seed_document_id UUID REFERENCES scenario_seed_documents(id) ON DELETE SET NULL,
  mode TEXT NOT NULL,
  horizon TEXT NOT NULL,
  trigger_source TEXT NOT NULL DEFAULT 'manual',
  trigger_key TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  miroshark_project_id TEXT,
  miroshark_graph_task_id TEXT,
  miroshark_simulation_id TEXT,
  miroshark_run_id TEXT,
  error JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- RLS for scenario_runs
ALTER TABLE scenario_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_scenario_runs ON scenario_runs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY service_write_scenario_runs ON scenario_runs
  FOR ALL TO service_role USING (true) WITH CHECK (true);


---------------------------------------------------------
-- 4. scenario_branches
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS scenario_branches (
  id TEXT PRIMARY KEY,
  run_id UUID REFERENCES scenario_runs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  tendency_type TEXT NOT NULL,
  probability_weight NUMERIC NOT NULL DEFAULT 0,
  confidence NUMERIC NOT NULL DEFAULT 0,
  horizon_relevance NUMERIC NOT NULL DEFAULT 0,
  deviation NUMERIC NOT NULL DEFAULT 0,
  coherence_delta NUMERIC NOT NULL DEFAULT 0,
  tension_delta NUMERIC NOT NULL DEFAULT 0,
  is_dashed BOOLEAN NOT NULL DEFAULT false,
  not_to_infer JSONB NOT NULL DEFAULT '[]'::jsonb,
  reflective_question TEXT,
  why_appears TEXT,
  what_resonates TEXT,
  where_friction TEXT,
  increase_coherence TEXT,
  source_weights JSONB NOT NULL DEFAULT '{}'::jsonb,
  related_hypothesis_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  epistemic_labels JSONB NOT NULL DEFAULT '[]'::jsonb,
  visual_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for scenario_branches
ALTER TABLE scenario_branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_branches ON scenario_branches
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY service_write_branches ON scenario_branches
  FOR ALL TO service_role USING (true) WITH CHECK (true);


---------------------------------------------------------
-- 5. scenario_agent_votes
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS scenario_agent_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES scenario_runs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  branch_id TEXT,
  agent_name TEXT,
  stance TEXT,
  observation TEXT,
  confidence NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for scenario_agent_votes
ALTER TABLE scenario_agent_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_agent_votes ON scenario_agent_votes
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY service_write_agent_votes ON scenario_agent_votes
  FOR ALL TO service_role USING (true) WITH CHECK (true);


---------------------------------------------------------
-- 6. scenario_run_events
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS scenario_run_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES scenario_runs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  stage TEXT NOT NULL,
  message TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for scenario_run_events
ALTER TABLE scenario_run_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_run_events ON scenario_run_events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY service_write_run_events ON scenario_run_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);


---------------------------------------------------------
-- 7. scenario_trigger_events
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS scenario_trigger_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  trigger_source TEXT NOT NULL,
  trigger_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'received',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for scenario_trigger_events
ALTER TABLE scenario_trigger_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_trigger_events ON scenario_trigger_events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY service_write_trigger_events ON scenario_trigger_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);


---------------------------------------------------------
-- Indexes for performance tuning
---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_ps_user_id ON scenario_pattern_states(user_id);
CREATE INDEX IF NOT EXISTS idx_sd_user_id ON scenario_seed_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_sr_user_id ON scenario_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_sb_run_id ON scenario_branches(run_id);
CREATE INDEX IF NOT EXISTS idx_sav_run_id ON scenario_agent_votes(run_id);
CREATE INDEX IF NOT EXISTS idx_sre_run_id ON scenario_run_events(run_id);
CREATE INDEX IF NOT EXISTS idx_ste_user_id ON scenario_trigger_events(user_id);
