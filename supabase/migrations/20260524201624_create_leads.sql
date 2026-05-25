-- Migration: create leads table (issue #85 / CP6)
-- LGPD: minimum data only — no phone, CPF, or raw IP stored.
-- ip_hash stores SHA-256(ip_address) for rate-limit lookups only.
-- Legal basis: legitimate interest (art. 7 VI Lei 13.709/2018).

CREATE TABLE leads (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text        NOT NULL,
  email            text        NOT NULL,
  company          text,
  product_interest text,
  message          text        NOT NULL,
  status           text        NOT NULL DEFAULT 'new'
                               CHECK (status IN ('new', 'read', 'archived')),
  ip_hash          text        NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE leads IS
  'Lead captures from public contact form. '
  'LGPD basis: legitimate interest (art. 7 VI Lei 13.709/2018). '
  'No raw IP, phone, or CPF stored.';

-- Paginated admin listing (most recent first)
CREATE INDEX leads_created_at_idx ON leads (created_at DESC);

-- Rate-limit lookup by hashed IP
CREATE INDEX leads_ip_hash_idx ON leads (ip_hash);

-- ── Grants ───────────────────────────────────────────────────────────────────
-- Explicit INSERT for anon (lead form); revoke SELECT to hide the table from
-- PostgREST/GraphQL schema introspection for anon and authenticated roles.
GRANT INSERT ON leads TO anon;
REVOKE SELECT ON leads FROM anon, authenticated;

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Any visitor (anon) can submit a lead
CREATE POLICY leads_insert_public
  ON leads
  FOR INSERT
  WITH CHECK (true);

-- Only users with app_metadata.role = 'owner' can read leads.
-- (select auth.jwt()) caches the JWT once per query instead of per row.
CREATE POLICY leads_select_owner
  ON leads
  FOR SELECT
  USING ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'owner');
