-- Adiciona flag de proteção nas categorias FAQ
alter table public.faq_categories
add column if not exists is_protected boolean default false not null;

-- Semente: categoria "Geral" protegida (fallback para artigos órfãos)
insert into public.faq_categories (label_pt, label_en, slug, display_order, is_protected)
values ('Geral', 'General', 'geral', 0, true)
on conflict (slug) do update set is_protected = true;

-- Troca o ON DELETE CASCADE → RESTRICT para forçar reassinalação no serviço
alter table public.faq_articles
drop constraint faq_articles_category_id_fkey;

alter table public.faq_articles
add constraint faq_articles_category_id_fkey
foreign key (category_id) references public.faq_categories(id) on delete restrict;
