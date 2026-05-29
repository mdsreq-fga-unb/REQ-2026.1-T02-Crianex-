-- 1. First, drop old policies to remove dependency on role/status columns before altering their types
drop policy if exists "profiles_self_read" on public.profiles;
drop policy if exists "owner_update_profiles" on public.profiles;
drop policy if exists "owner_insert_profiles" on public.profiles;
drop policy if exists "owner_delete_profiles" on public.profiles;
drop policy if exists "profiles_owner_all" on public.profiles;
drop policy if exists "profiles_member_read" on public.profiles;
drop policy if exists "profiles_member_update" on public.profiles;

-- 2. Alter columns in public.profiles:
-- First, drop default constraints so we can change the type
alter table public.profiles alter column role drop default;
alter table public.profiles alter column status drop default;

-- Change role column type to text
alter table public.profiles 
  alter column role set data type text using role::text;

-- Add check constraint for role
alter table public.profiles 
  add constraint profiles_role_check check (role in ('owner', 'member'));

-- Set default for role
alter table public.profiles alter column role set default 'member';

-- Change status column type to text
alter table public.profiles 
  alter column status set data type text using status::text;

-- Add check constraint for status
alter table public.profiles 
  add constraint profiles_status_check check (status in ('active', 'inactive'));

-- Set default for status
alter table public.profiles alter column status set default 'active';

-- Drop the old enum types
drop type if exists role_type;
drop type if exists status_type;

-- 3. Make sure name and email are NOT NULL:
-- Update existing null names to a default value first to prevent constraint violations
update public.profiles set name = 'Novo Membro' where name is null;
alter table public.profiles alter column name set not null;

-- Make sure email is not null (should already be populated, but enforce it)
update public.profiles set email = 'membro_' || id || '@crianex.local' where email is null;
alter table public.profiles alter column email set not null;


-- 4. Update trigger function for handle_new_user:
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


-- 5. Create is_owner function for RLS policy to bypass recursion
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


-- 6. Create RLS policies:
-- Policy for owner: full CRUD access
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

-- Policy for member: read self only
create policy "profiles_member_read"
on public.profiles
for select
to authenticated
using (
    auth.uid() = id
);

-- Policy for member: update self only
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
