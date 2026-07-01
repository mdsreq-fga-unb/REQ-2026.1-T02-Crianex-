-- Migration: capture_lead RPC — captação pública de lead em transação ACID
-- (F19 · CP1 — CRM Interno de Clientes · issue #192, sub-issue de #177)
--
-- Cria, em UMA única transação, o client (deduplicado por e-mail) + o client_card
-- na coluna default do funil + a notification do novo lead. O corpo de uma função
-- PL/pgSQL roda dentro de uma única transação: se qualquer passo falhar, todos os
-- INSERTs sofrem rollback — nada parcial persiste ("tudo ou nada", RF37).
--
-- Depende de: clients/client_cards (#191), notifications (#186), seed da coluna
-- default do funil (#185). O column_id é deixado NULL de propósito para que o
-- trigger client_cards_set_default_column resolva o estágio default no INSERT.

CREATE OR REPLACE FUNCTION public.capture_lead(
  p_nome     text,
  p_email    text,
  p_conteudo text,
  p_telefone text DEFAULT NULL
)
RETURNS TABLE (client_id uuid, card_id uuid, notification_id uuid)
LANGUAGE plpgsql
AS $$
DECLARE
  v_client_id       uuid;
  v_card_id         uuid;
  v_notification_id uuid;
BEGIN
  -- 1) Client deduplicado por e-mail: um visitante recorrente reaproveita a mesma
  --    pessoa (a tabela clients tem UNIQUE(email)). DO UPDATE garante o RETURNING.
  INSERT INTO public.clients (nome, email, telefone)
  VALUES (p_nome, p_email, p_telefone)
  ON CONFLICT (email) DO UPDATE
    SET nome     = EXCLUDED.nome,
        telefone = COALESCE(EXCLUDED.telefone, public.clients.telefone)
  RETURNING id INTO v_client_id;

  -- 2) Card no board do CRM. column_id NULL → trigger client_cards_set_default_column
  --    resolve a coluna inicial padrão do funil (RF37 / RN19).
  INSERT INTO public.client_cards (client_id, column_id)
  VALUES (v_client_id, NULL)
  RETURNING id INTO v_card_id;

  -- 3) Notificação do novo lead (status default 'unread').
  INSERT INTO public.notifications (tipo, conteudo)
  VALUES ('novo_lead', p_conteudo)
  RETURNING id INTO v_notification_id;

  RETURN QUERY SELECT v_client_id, v_card_id, v_notification_id;
END;
$$;

COMMENT ON FUNCTION public.capture_lead(text, text, text, text) IS
  'Captação pública de lead: cria client (dedup por e-mail) + client_card '
  '(coluna default) + notification atomicamente. Usada por POST /api/public/contact (F19).';

REVOKE ALL ON FUNCTION public.capture_lead(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.capture_lead(text, text, text, text) TO service_role;
