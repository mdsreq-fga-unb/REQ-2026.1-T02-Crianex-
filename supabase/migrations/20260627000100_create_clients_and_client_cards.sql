-- Migration: create clients and client_cards tables (F19 · CP1 — CRM Interno de Clientes)
-- Ref: issue #191 (sub-issue of #177). Blocked by crm_columns schema (F20).
-- RLS: admin-only (app_metadata.role = 'owner'), matching leads and crm_columns (RNF09).

-- ── clients ────────────────────────────────────────────────────────────────────
CREATE TABLE public.clients (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        text        NOT NULL CHECK (length(trim(nome)) > 0),
  email       text        NOT NULL UNIQUE,
  telefone    text,
  status      text        NOT NULL DEFAULT 'ativo'
                          CHECK (status IN ('ativo', 'inativo')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.clients IS
  'CRM clients. Deduplicated person/account; cards reference a client via client_cards.';

CREATE INDEX clients_created_at_idx ON public.clients (created_at DESC);

-- ── client_cards ───────────────────────────────────────────────────────────────
-- A card places a client on the CRM board (a crm_columns pipeline stage).
CREATE TABLE public.client_cards (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         uuid        NOT NULL REFERENCES public.clients(id)     ON DELETE CASCADE,
  column_id         uuid        NOT NULL REFERENCES public.crm_columns(id) ON DELETE RESTRICT,
  produto_vinculado uuid                 REFERENCES public.products(id)     ON DELETE SET NULL,
  responsavel       text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.client_cards IS
  'Places a client on the CRM board. column_id defaults to the crm_columns '
  'default stage at creation (RF37); produto_vinculado links the related SaaS product.';

CREATE INDEX client_cards_client_id_idx         ON public.client_cards (client_id);
CREATE INDEX client_cards_column_id_idx         ON public.client_cards (column_id);
CREATE INDEX client_cards_produto_vinculado_idx ON public.client_cards (produto_vinculado);

-- RF37: a new card lands in the default pipeline column when none is given.
-- Resolved at insert time so the card always references the current default.
CREATE OR REPLACE FUNCTION public.client_cards_set_default_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF new.column_id IS NULL THEN
    SELECT id INTO new.column_id
    FROM public.crm_columns
    WHERE is_default = true
    LIMIT 1;

    IF new.column_id IS NULL THEN
      RAISE EXCEPTION 'client_cards: no default crm_columns stage configured';
    END IF;
  END IF;
  RETURN new;
END;
$$;

CREATE TRIGGER client_cards_set_default_column
  BEFORE INSERT ON public.client_cards
  FOR EACH ROW EXECUTE FUNCTION public.client_cards_set_default_column();

-- ── Grants ───────────────────────────────────────────────────────────────────
-- service_role bypasses RLS (backend admin queries); authenticated is gated by
-- the owner-only policy below. anon is revoked to hide tables from PostgREST.
GRANT ALL ON public.clients      TO service_role;
GRANT ALL ON public.client_cards TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_cards TO authenticated;
REVOKE ALL ON public.clients      FROM anon;
REVOKE ALL ON public.client_cards FROM anon;

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE public.clients      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_cards ENABLE ROW LEVEL SECURITY;

-- Only owner-role admins can manage CRM clients/cards (RNF09).
-- (SELECT auth.jwt()) caches the JWT once per query instead of per row.
CREATE POLICY clients_owner_all ON public.clients
  FOR ALL
  TO authenticated
  USING      ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'owner')
  WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'owner');

CREATE POLICY client_cards_owner_all ON public.client_cards
  FOR ALL
  TO authenticated
  USING      ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'owner')
  WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'owner');
