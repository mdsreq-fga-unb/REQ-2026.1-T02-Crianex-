-- Migration: grant DML on public.products to API roles
--
-- A migration original de products (20260523000000) criou a tabela SEM grants
-- explícitos de DML. Em projetos Supabase hospedados isso "funciona" por
-- privilégios herdados configurados no provisionamento do projeto, mas em um
-- stack limpo aplicado só pelas migrations (ex.: `supabase db reset` no CI) o
-- backend recebe 42501 "permission denied for table products" ao inserir/
-- atualizar/remover produtos. Alinha products ao padrão de notifications/crm_columns.
--
-- RLS continua valendo: anon/authenticated só enxergam produtos publicados pela
-- policy de SELECT; service_role (usado pelo backend) tem acesso total.

GRANT ALL ON public.products TO service_role;
GRANT SELECT ON public.products TO anon, authenticated;
