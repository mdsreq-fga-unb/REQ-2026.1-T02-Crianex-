-- Tabela crm_columns (F20 — Gerenciar colunas do funil) — issue #181
-- Invariantes garantidas por constraint/trigger (não dependem da validação da API):
--   1. Deve existir sempre ao menos 1 coluna
--   2. Deve existir sempre exatamente 1 coluna marcada como is_default

create table public.crm_columns (
    id uuid default gen_random_uuid() primary key,
    nome text not null,
    ordem integer not null,
    is_default boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Garante "no máximo 1 default" de forma imediata (índice único parcial)
create unique index crm_columns_single_default_idx
on public.crm_columns (is_default)
where is_default = true;

-- Garante "ao menos 1 coluna" e "exatamente 1 default" ao final de cada
-- UPDATE/DELETE, permitindo trocas de default dentro da mesma transação
-- (ex.: marcar uma nova coluna como default e desmarcar a antiga).
create or replace function public.check_crm_columns_invariants()
returns trigger
language plpgsql
as $$
begin
    if (select count(*) from public.crm_columns) = 0 then
        raise exception 'crm_columns: deve existir ao menos 1 coluna';
    end if;

    if (select count(*) from public.crm_columns where is_default = true) <> 1 then
        raise exception 'crm_columns: deve existir exatamente 1 coluna marcada como is_default';
    end if;

    return null;
end;
$$;

-- "initially immediate" (padrão) avalia a invariante ao final de cada
-- statement (não a cada linha), permitindo UPDATEs multi-linha que trocam o
-- default atomicamente dentro de um único comando.
create constraint trigger crm_columns_invariants_on_update
after update on public.crm_columns
deferrable initially immediate
for each row
execute function public.check_crm_columns_invariants();

create constraint trigger crm_columns_invariants_on_delete
after delete on public.crm_columns
deferrable initially immediate
for each row
execute function public.check_crm_columns_invariants();

create index idx_crm_columns_ordem on public.crm_columns (ordem);

alter table public.crm_columns enable row level security;

create policy "Permitir leitura e gerenciamento de colunas do CRM para owners"
on public.crm_columns
for all
to authenticated
using (public.is_owner(auth.uid()))
with check (public.is_owner(auth.uid()));

-- Revoga acesso default do PostgREST: anon não deve nem aparecer na
-- introspecção do schema. authenticated mantém grant de tabela, mas a RLS
-- acima já restringe leitura/escrita a quem é owner.
revoke all on table public.crm_columns from anon;
grant all on table public.crm_columns to authenticated;
grant all on table public.crm_columns to service_role;

-- Seed inicial — necessário para que demais features do CRM (F19/F21) possam
-- operar, já que toda issue do funil depende de ao menos 1 coluna existente.
insert into public.crm_columns (nome, ordem, is_default) values
    ('Novo Lead', 1, true),
    ('Em Contato', 2, false),
    ('Proposta', 3, false),
    ('Fechado', 4, false);
