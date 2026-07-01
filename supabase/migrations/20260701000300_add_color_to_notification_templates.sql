-- Migration: add color customization to notification_templates (F08 · CP9)
-- Ref: personalização de notificações por tipo de evento — cor de destaque
-- escolhida pelo admin ao configurar o template, usada para colorir a
-- notificação resultante na central de notificações (F07).
--
-- Default '#7f3fe5' (roxo) preserva a cor hoje hardcoded no frontend para
-- notificações sem template configurado (iconForTipo), então linhas
-- existentes continuam com o mesmo visual após a migration.

ALTER TABLE public.notification_templates
  ADD COLUMN color text NOT NULL DEFAULT '#7f3fe5'
    CHECK (color ~ '^#[0-9a-fA-F]{6}$');
