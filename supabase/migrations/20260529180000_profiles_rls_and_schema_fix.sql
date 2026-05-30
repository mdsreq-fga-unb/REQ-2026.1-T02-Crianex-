-- 1. Drop old policies to remove dependency on role/status columns before altering their types
drop policy if exists "profiles_self_read" on public.profiles;
drop policy if exists "owner_update_profiles" on public.profiles;
drop policy if exists "owner_insert_profiles" on public.profiles;
drop policy if exists "owner_delete_profiles" on public.profiles;
drop policy if exists "profiles_owner_all" on public.profiles;
drop policy if exists "profiles_member_read" on public.profiles;
drop policy if exists "profiles_member_update" on public.profiles;

-- Fix moddatetime trigger (was created without column argument in migration 20260523000000)
drop trigger if exists handle_products_updated_at on public.products;
create trigger handle_products_updated_at
    before update on public.products
    for each row
    execute function extensions.moddatetime(updated_at);

-- 2. Alter columns in public.profiles:
alter table public.profiles alter column role drop default;
alter table public.profiles alter column status drop default;

alter table public.profiles
  alter column role set data type text using role::text;

alter table public.profiles
  add constraint profiles_role_check check (role in ('owner', 'member'));

alter table public.profiles alter column role set default 'member';

alter table public.profiles
  alter column status set data type text using status::text;

alter table public.profiles
  add constraint profiles_status_check check (status in ('active', 'inactive'));

alter table public.profiles alter column status set default 'active';

drop type if exists role_type;
drop type if exists status_type;

-- 3. Enforce NOT NULL on name and email
update public.profiles set name = 'Novo Membro' where name is null;
alter table public.profiles alter column name set not null;

do $$
begin
  if exists (select 1 from public.profiles where email is null) then
    raise exception 'profiles com email NULL encontrados — corrija manualmente antes de aplicar esta migration';
  end if;
end;
$$;
alter table public.profiles alter column email set not null;

-- 4. Update trigger function for handle_new_user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
    insert into public.profiles (
        id,
        name,
        email,
        role,
        status
    )
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Membro'),
        new.email,
        'member',
        'active'
    );
    return new;
end;
$$;

-- 5. Create is_owner function (SECURITY DEFINER + search_path to avoid RLS recursion)
create or replace function public.is_owner(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
    and role = 'owner'
  );
$$;

-- 6. RPC to reorder products (owner only)
create or replace function public.reorder_products(p_orders jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  if not public.is_owner(auth.uid()) then
    raise exception 'permission denied: only owners can reorder products';
  end if;

  for r in select * from jsonb_to_recordset(p_orders) as x(id uuid, display_order int) loop
    update public.products
    set display_order = r.display_order
    where id = r.id;
  end loop;
end;
$$;

-- 7. Create RLS policies
create policy "profiles_owner_all"
on public.profiles
for all
to authenticated
using (
    public.is_owner(auth.uid())
)
with check (
    public.is_owner(auth.uid())
);

create policy "profiles_member_read"
on public.profiles
for select
to authenticated
using (
    auth.uid() = id
);

create policy "profiles_member_update"
on public.profiles
for update
to authenticated
using (
    auth.uid() = id
)
with check (
    auth.uid() = id
);
