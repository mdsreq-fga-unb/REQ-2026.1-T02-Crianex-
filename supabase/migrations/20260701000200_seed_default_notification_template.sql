-- Seed: template padrão de fallback para notificações (F08 — issue #205)
-- Idempotente: só insere quando não existe nenhum template com is_default=true,
-- garantindo que a remoção de um template específico sempre recaia em um
-- fallback funcional (RF57), mesmo em um ambiente recém-provisionado.

INSERT INTO public.notification_templates (tipo_evento, nome, conteudo, is_default, active)
SELECT '__default__', 'Template padrão de fallback',
       'Um evento do tipo {{tipo_evento}} ocorreu.', true, true
WHERE NOT EXISTS (SELECT 1 FROM public.notification_templates WHERE is_default = true);
