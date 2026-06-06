grant all on table public.faq_categories to service_role;
grant all on table public.faq_articles to service_role;

grant select on table public.faq_categories to anon;
grant select on table public.faq_articles to anon;

grant select, insert, update, delete on table public.faq_categories to authenticated;
grant select, insert, update, delete on table public.faq_articles to authenticated;
