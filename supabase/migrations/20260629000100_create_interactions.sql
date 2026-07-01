-- Migration: create interactions table (F21 / CP1 - CRM Interno de Clientes)
-- Ref: feature #178. Depends on clients/client_cards schema (#191).
-- RLS: admin-only (app_metadata.role = 'owner'), matching clients and crm_columns.

CREATE TABLE public.interactions (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id  uuid        NOT NULL REFERENCES public.clients(id)  ON DELETE RESTRICT,
  autor_id   uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  tipo       text        NOT NULL CHECK (length(trim(tipo)) > 0),
  conteudo   text        NOT NULL CHECK (length(trim(conteudo)) > 0),
  data       timestamptz NOT NULL DEFAULT now(),
  removed    boolean     NOT NULL DEFAULT false
);

COMMENT ON TABLE public.interactions IS
  'Commercial interaction history for CRM clients. Use removed=true for soft-delete.';

CREATE INDEX interactions_client_data_idx
  ON public.interactions (client_id, data DESC)
  WHERE removed = false;

CREATE INDEX interactions_autor_id_idx ON public.interactions (autor_id);

-- Default listing surface: keep audit rows in interactions, hide soft-deleted rows.
CREATE VIEW public.active_interactions
WITH (security_invoker = true)
AS
SELECT
  id,
  client_id,
  autor_id,
  tipo,
  conteudo,
  data,
  removed
FROM public.interactions
WHERE removed = false;

-- Grants ---------------------------------------------------------------------
-- service_role bypasses RLS (backend admin queries); authenticated is gated by
-- the owner-only policy below. anon is revoked to hide the table/view.
GRANT ALL ON public.interactions TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.interactions TO authenticated;
GRANT SELECT ON public.active_interactions TO service_role;
GRANT SELECT ON public.active_interactions TO authenticated;
REVOKE DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.interactions FROM authenticated;
REVOKE ALL ON public.interactions FROM anon;
REVOKE ALL ON public.active_interactions FROM anon;

-- RLS ------------------------------------------------------------------------
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- Only owner-role admins can manage commercial interactions (RNF09).
-- (SELECT auth.jwt()) caches the JWT once per query instead of per row.
CREATE POLICY interactions_owner_all ON public.interactions
  FOR ALL
  TO authenticated
  USING      ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'owner')
  WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'owner');
