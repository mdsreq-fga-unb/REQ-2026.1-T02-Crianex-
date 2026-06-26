-- Seed: default pipeline columns for CRM board (F20 — issue #185)
-- Idempotent: only inserts when table is empty, satisfying the ≥1 default invariant
-- required for any lead capture (RF37) to function on a fresh environment.

INSERT INTO public.crm_columns (title, color, position, is_default, entry_hint, exit_hint)
SELECT v.title, v.color, v.position, v.is_default, v.entry_hint, v.exit_hint
FROM (VALUES
  ('Novo Lead',     '#7f3fe5', 0, true,  'Lead entra pelo formulário público ou cadastro manual.', 'Sai quando o primeiro contato é realizado e há fit inicial.'),
  ('Qualificado',   '#3b82f6', 1, false, 'Contato feito, perfil e orçamento confirmados.',         'Sai ao enviar proposta comercial formal.'),
  ('Em negociação', '#f59e0b', 2, false, 'Proposta enviada, em discussão de escopo e preço.',      'Sai com a decisão do cliente (ganho ou perdido).'),
  ('Fechado',       '#66df7a', 3, false, 'Contrato assinado e provisionamento iniciado.',           '—'),
  ('Perdido',       '#9a968e', 4, false, 'Cliente declinou ou ficou sem resposta por 30+ dias.',    'Pode ser reaberto em uma nova oportunidade.')
) AS v(title, color, position, is_default, entry_hint, exit_hint)
WHERE NOT EXISTS (SELECT 1 FROM public.crm_columns);
