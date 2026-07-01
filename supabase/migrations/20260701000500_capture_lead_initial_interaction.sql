-- Migration: capture_lead também registra a mensagem do formulário como a
-- primeira interação comercial do lead (F19/RF37) — antes só virava notification.
--
-- interactions.autor_id é NOT NULL REFERENCES profiles(id): a captação pública
-- não tem um profile autenticado por trás, então a coluna precisa aceitar NULL
-- para essa origem específica (mensagem do próprio lead, não de um admin).

ALTER TABLE public.interactions ALTER COLUMN autor_id DROP NOT NULL;

-- Novo parâmetro (p_mensagem) muda a assinatura da função: Postgres trataria a
-- versão antiga como um overload distinto em vez de substituí-la, então o DROP
-- evita ficarmos com capture_lead/4 e capture_lead/5 coexistindo.
DROP FUNCTION IF EXISTS public.capture_lead(text, text, text, text);

CREATE OR REPLACE FUNCTION public.capture_lead(
  p_nome     text,
  p_email    text,
  p_conteudo text,
  p_telefone text DEFAULT NULL,
  p_mensagem text DEFAULT NULL
)
RETURNS TABLE (client_id uuid, card_id uuid, notification_id uuid, interaction_id uuid)
LANGUAGE plpgsql
AS $$
DECLARE
  v_client_id       uuid;
  v_card_id         uuid;
  v_notification_id uuid;
  v_interaction_id  uuid;
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

  -- 4) Mensagem original do lead vira a primeira interação do histórico do card
  --    (autor_id NULL — veio do formulário público, não de um admin autenticado).
  IF p_mensagem IS NOT NULL AND length(trim(p_mensagem)) > 0 THEN
    INSERT INTO public.interactions (client_id, autor_id, tipo, conteudo)
    VALUES (v_client_id, NULL, 'formulario', p_mensagem)
    RETURNING id INTO v_interaction_id;
  END IF;

  RETURN QUERY SELECT v_client_id, v_card_id, v_notification_id, v_interaction_id;
END;
$$;

COMMENT ON FUNCTION public.capture_lead(text, text, text, text, text) IS
  'Captação pública de lead: cria client (dedup por e-mail) + client_card '
  '(coluna default) + notification + interaction inicial (mensagem do lead) '
  'atomicamente. Usada por POST /api/public/contact (F19).';

REVOKE ALL ON FUNCTION public.capture_lead(text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.capture_lead(text, text, text, text, text) TO service_role;
