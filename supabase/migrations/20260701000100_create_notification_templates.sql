-- Migration: create notification_templates table (F08 · CP9 — Sistema de Notificações)
-- Ref: issue #180, sub-issue #201. Templates usados para padronizar o conteúdo de
-- notificações geradas por eventos do sistema (F07/notifications).
-- RLS: admin-only (app_metadata.role = 'owner'), igual a notifications (RNF09).

CREATE TABLE public.notification_templates (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_evento text        NOT NULL CHECK (length(trim(tipo_evento)) > 0),
  nome        text        NOT NULL CHECK (length(trim(nome)) > 0),
  conteudo    text        NOT NULL CHECK (length(trim(conteudo)) > 0),
  is_default  boolean     NOT NULL DEFAULT false,
  active      boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Impede duplicidade: no máximo 1 template ATIVO por tipo_evento (RF15).
-- Templates inativados não contam, então um tipo_evento pode ter histórico de
-- templates inativos sem bloquear a criação de um novo ativo.
CREATE UNIQUE INDEX notification_templates_tipo_evento_active_idx
  ON public.notification_templates (tipo_evento)
  WHERE active;

-- Auto-bump updated_at (mesmo padrão de crm_columns/products)
CREATE TRIGGER notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

GRANT ALL ON public.notification_templates TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_templates TO authenticated;
REVOKE ALL ON public.notification_templates FROM anon;

ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY notification_templates_owner_all ON public.notification_templates
  FOR ALL
  TO authenticated
  USING      ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'owner')
  WITH CHECK ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role' = 'owner');
