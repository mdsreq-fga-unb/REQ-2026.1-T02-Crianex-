create schema if not exists extensions;
create extension if not exists moddatetime with schema extensions;
create extension if not exists unaccent with schema extensions;

create or replace function public.slugify(input text)
returns text
language sql
immutable
as $$
    select regexp_replace(
        regexp_replace(
            lower(extensions.unaccent(trim(input))),
            '[^a-z0-9]+',
            '-',
            'g'
        ),
        '(^-|-$)',
        '',
        'g'
    );
$$;

create table public.faq_categories (
    id uuid default gen_random_uuid() primary key,
    label_pt text not null,
    label_en text not null,
    product_id uuid references public.products(id) on delete set null,
    display_order integer default 0 not null,
    slug text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.faq_articles (
    id uuid default gen_random_uuid() primary key,
    title_pt text not null,
    title_en text not null,
    body_pt text not null,
    body_en text not null,
    category_id uuid not null references public.faq_categories(id) on delete cascade,
    published boolean default false not null,
    published_at timestamp with time zone,
    helpful_count integer default 0 not null,
    not_helpful_count integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    slug text not null unique
);

create or replace function public.set_faq_category_slug()
returns trigger
language plpgsql
as $$
begin
    if coalesce(new.slug, '') = '' then
        new.slug := public.slugify(new.label_pt);
    end if;

    return new;
end;
$$;

create or replace function public.set_faq_article_slug()
returns trigger
language plpgsql
as $$
begin
    if coalesce(new.slug, '') = '' then
        new.slug := public.slugify(new.title_pt);
    end if;

    return new;
end;
$$;

create trigger handle_faq_categories_slug
before insert or update of label_pt, slug
on public.faq_categories
for each row
execute function public.set_faq_category_slug();

create trigger handle_faq_articles_slug
before insert or update of title_pt, slug
on public.faq_articles
for each row
execute function public.set_faq_article_slug();

create trigger handle_faq_articles_updated_at
before update on public.faq_articles
for each row
execute function extensions.moddatetime(updated_at);

alter table public.faq_categories enable row level security;
alter table public.faq_articles enable row level security;

create policy "Permitir leitura pública de categorias FAQ"
on public.faq_categories
for select
using (true);

create policy "Permitir leitura pública de artigos FAQ publicados"
on public.faq_articles
for select
using (published = true);

create policy "Permitir gerenciamento de categorias FAQ para owners"
on public.faq_categories
for all
to authenticated
using (public.is_owner(auth.uid()))
with check (public.is_owner(auth.uid()));

create policy "Permitir gerenciamento de artigos FAQ para owners"
on public.faq_articles
for all
to authenticated
using (public.is_owner(auth.uid()))
with check (public.is_owner(auth.uid()));

create index idx_faq_categories_product_id
on public.faq_categories(product_id);

create index idx_faq_categories_display_order
on public.faq_categories(display_order);

create index idx_faq_articles_category_id
on public.faq_articles(category_id);

create index idx_faq_articles_published
on public.faq_articles(published);