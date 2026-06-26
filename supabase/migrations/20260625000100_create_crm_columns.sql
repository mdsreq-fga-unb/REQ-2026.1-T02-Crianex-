-- Migration: create crm_columns table (F20 · CP1 — CRM Interno de Clientes)
-- Ref: issue #181 (closed), re-applied as versioned migration.
-- Invariant: exactly 1 is_default column enforced by partial unique index.

CREATE TABLE IF NOT EXISTS public.crm_columns (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL CHECK (length(trim(title)) > 0),
  color       text        NOT NULL DEFAULT '#7f3fe5',
  position    integer     NOT NULL DEFAULT 0,
  is_default  boolean     NOT NULL DEFAULT false,
  entry_hint  text,
  exit_hint   text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Exactly 1 default column at all times
CREATE UNIQUE INDEX IF NOT EXISTS crm_columns_one_default_idx
  ON public.crm_columns (is_default)
  WHERE is_default = true;

CREATE INDEX IF NOT EXISTS crm_columns_position_idx ON public.crm_columns (position);

-- Auto-bump updated_at
CREATE TRIGGER crm_columns_updated_at
  BEFORE UPDATE ON public.crm_columns
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE public.crm_columns ENABLE ROW LEVEL SECURITY;

-- Only owner-role admins can manage pipeline columns (RNF09 — RLS)
CREATE POLICY "crm_columns_owner_all" ON public.crm_columns
  FOR ALL
  TO authenticated
  USING  ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'owner')
  WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'owner');

GRANT ALL ON public.crm_columns TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_columns TO authenticated;
