create type role_type as enum (
    'owner',
    'member'
);

create type status_type as enum (
    'active',
    'inactive'
);

create table public.profiles (
    id uuid primary key
        references auth.users(id)
        on delete cascade,

    name text,

    email text unique,

    role role_type not null default 'member',

    status status_type not null default 'active',

    avatar_url text,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles
enable row level security;
